package io.taedl.api.services;

import com.google.common.collect.ImmutableMap;
import io.taedl.api.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RdConnectionService implements ConnectionService {

    private final String supportedDrivers;
    private final QueryBuildingService queryBuildingService;
    private final String MYSQL_UTC_TIMEZONE = "?useLegacyDatetimeCode=false&serverTimezone=UTC";

    // setting select method cursor, otherwise ResultSetMetaData.getTableName returns blank
    // https://github.com/Microsoft/mssql-jdbc/issues/753
    private final String SQL_SERVER_SELECT_METHOD_CURSOR = ";selectMethod=cursor";

    private final String sampleUser;
    private final String sampleEndpoint;
    private final String sampleVendor;
    private final String samplePassword;

    private final String sample = "sample";
    private final String samplePostgresEndpoint = "jdbc:postgresql://sample/sample";

    @Autowired
    public RdConnectionService(@Value("${packaged.jdbc.driver.classes}") String supportedDrivers,
                               QueryBuildingService queryBuildingService,
                               @Value("${sample.user}") String sampleUser,
                               @Value("${sample.endpoint}") String sampleEndpoint,
                               @Value("${sample.vendor}") String sampleVendor,
                               @Value("${sample.password}") String samplePassword) {
        this.supportedDrivers = supportedDrivers;
        this.queryBuildingService = queryBuildingService;
        this.sampleUser = sampleUser;
        this.sampleEndpoint = sampleEndpoint;
        this.sampleVendor = sampleVendor;
        this.samplePassword = samplePassword;
    }


    @Override
    public boolean testConnection(ConnectionDetails connectionDetails) throws ClassNotFoundException {
        boolean flag = false;
        mySQLTimeZoneSetUTC(connectionDetails);
        setIfExample(connectionDetails);

        try (java.sql.Connection conn = DriverManager.getConnection(connectionDetails.getEndpoint(), connectionDetails.getUser(), connectionDetails.getPassword())) {
            if (conn != null) {
                flag = true;
            }
        } catch (Exception ignored) {
            log.info("Failed to connect to an instance of {}", connectionDetails.getVendor());
        }
        return flag;
    }

    @Override
    public List<String> vendors() {
        return Arrays.asList(supportedDrivers.split(","));
    }

    private String driver(String vendor) {
        String[] pairs = supportedDrivers.split(",");
        for (String pair: pairs) {
            if (pair.split("\\|")[0].equals(vendor)) {
                return pair.split("\\|")[1];
            }
        }
        return null;
    }

    @Override
    public List<TableMetaData> tables(ConnectionDetails connectionDetails) throws SQLException {
        mySQLTimeZoneSetUTC(connectionDetails);
        sqlServerSetCursor(connectionDetails);
        setIfExample(connectionDetails);

        try (Connection conn = DriverManager.getConnection(connectionDetails.getEndpoint(), connectionDetails.getUser(), connectionDetails.getPassword())) {
            DatabaseMetaData metaData = conn.getMetaData();

            // TODO: catalogue and schema are not always default
            // TODO: currently for SQL Server this returns system tables too, which it should not
            String catalog = null;
            String schemaPattern = null;
            String tableNamePattern = connectionDetails.getVendor().equals("mysql") ? "%" : null;
            String[] types = {"TABLE"};
            ResultSet result = metaData.getTables(catalog, schemaPattern, tableNamePattern, types);

            List<String> tableList = new ArrayList<>();
            while (result.next()) {
                tableList.add(result.getString(3));
            }
            result.close();
            List<TableMetaData> tables = new ArrayList<>();
            for (String table : tableList) {
                tables.add(generateSchema(metaData, table));
            }
            return tables;
        }
    }

    @Override
    public Table preview(ConnectionDetails connectionDetails, List<TableMetaData> tables, List<Join> joins) throws SQLException {
        mySQLTimeZoneSetUTC(connectionDetails);
        sqlServerSetCursor(connectionDetails);
        setIfExample(connectionDetails);

        String query = queryBuildingService.generatePreviewQuery(tables, joins, connectionDetails.getVendor());
        log.info("Generated preview query: {}", query);
        return createTable(connectionDetails, tables, query);
    }

    @Override
    public Table tableReport(ConnectionDetails connectionDetails, List<TableMetaData> tables, List<Column> columns,
                             List<AggregatedColumn> rows, List<Join> joins, List<Filter> filters) throws ClassNotFoundException, SQLException {

        mySQLTimeZoneSetUTC(connectionDetails);
        sqlServerSetCursor(connectionDetails);
        setIfExample(connectionDetails);

        String query = queryBuildingService.generateTableQuery(tables, columns, rows, joins, filters, connectionDetails.getVendor());
        log.info("Generated table query: {}", query);
        List<TableMetaData> tablesToJoin = tables.stream().filter(t -> !Collections.disjoint(t.getColumns(), columns)).collect(Collectors.toList());
        return createTable(connectionDetails, tablesToJoin, query);
    }

    private Table createTable(ConnectionDetails connectionDetails, List<TableMetaData> tables, String query) throws SQLException {

        mySQLTimeZoneSetUTC(connectionDetails);
        sqlServerSetCursor(connectionDetails);
        setIfExample(connectionDetails);

        Table table;
        try (Connection conn = DriverManager.getConnection(connectionDetails.getEndpoint(), connectionDetails.getUser(), connectionDetails.getPassword())) {
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();
            ResultSetMetaData meta = resultSet.getMetaData();
            table = new Table(resultSet, meta, tables);
        }
        return table;
    }

    private TableMetaData generateSchema(DatabaseMetaData metaData, String tableName) throws SQLException {
        TableMetaData table = new TableMetaData();
        table.setName(tableName);

        table.setPrimaryKey(primaryKey(metaData, tableName));
        table.setExportedKeys(foreignKeys(metaData, tableName, "exported"));
        table.setImportedKeys(foreignKeys(metaData, tableName, "imported"));
        table.setColumns(columns(metaData, tableName));
        return table;
    }

    private Column primaryKey(DatabaseMetaData metaData, String tableName) throws SQLException {
        // TODO: catalogue and schema must be configurable - they will not always be default
        ResultSet primaryKeys = metaData.getPrimaryKeys(null, null, tableName);
        Column key = null;
        if (primaryKeys != null) {
            primaryKeys.next();
            try {
                key = new Column(primaryKeys.getString(4), tableName, null, null);
            } catch (Exception ignoring) {
                log.warn("Could not extract primary key for table {}", tableName);
            }
            primaryKeys.close();
        }
        return key;
    }

    private List<Map<String, Column>> foreignKeys(DatabaseMetaData metaData, String tableName, String exportImport) throws SQLException {
        ResultSet foreignKeys = exportImport.equals("exported") ? metaData.getExportedKeys(null, null, tableName) :
                metaData.getImportedKeys(null, null, tableName);
        List<Map<String, Column>> keys = new ArrayList<>();

        while (foreignKeys.next()) {
            try {
                String fkTableName = foreignKeys.getString("FKTABLE_NAME");
                String fkColumnName = foreignKeys.getString("FKCOLUMN_NAME");

                String pkTableName = foreignKeys.getString("PKTABLE_NAME");
                String pkColumnName = foreignKeys.getString("PKCOLUMN_NAME");

                Column foreignKey = new Column(fkColumnName, fkTableName, null, null);
                Column primaryKey = new Column(pkColumnName, pkTableName, null, null);
                keys.add(ImmutableMap.of("primary", primaryKey, "foreign", foreignKey));
            } catch (Exception ignoring) {
                log.warn("Could not extract foreign keys for table {}", tableName);
            }
        }
        foreignKeys.close();
        return keys;
    }

    private List<Column> columns(DatabaseMetaData metaData, String tableName) throws SQLException {
        ResultSet resultColumns = metaData.getColumns(null, null, tableName, null);
        List<Column> columns = new ArrayList<>();

        while (resultColumns.next()) {
            columns.add(
                    new Column(resultColumns.getString("COLUMN_NAME"), tableName, resultColumns.getString("TYPE_NAME"),
                            resultColumns.getString("COLUMN_SIZE")));
        }
        resultColumns.close();
        return columns;
    }

    private void mySQLTimeZoneSetUTC(ConnectionDetails connectionDetails) {
        if (connectionDetails.getVendor().equals("mysql") && !connectionDetails.getEndpoint().endsWith(MYSQL_UTC_TIMEZONE)) {
            String ep = connectionDetails.getEndpoint();
            connectionDetails.setEndpoint(ep.concat(MYSQL_UTC_TIMEZONE));
        }
    }

    private void sqlServerSetCursor(ConnectionDetails connectionDetails) {
        if (connectionDetails.getVendor().equals("sqlserver") && !connectionDetails.getEndpoint().contains(SQL_SERVER_SELECT_METHOD_CURSOR)) {
            String ep = connectionDetails.getEndpoint();
            connectionDetails.setEndpoint(ep.concat(SQL_SERVER_SELECT_METHOD_CURSOR));
        }
    }

    private void setIfExample(ConnectionDetails connectionDetails) {
        if (connectionDetails.getEndpoint().equals(samplePostgresEndpoint) &&
                connectionDetails.getUser().equals(sample) &&
                connectionDetails.getPassword().equals(sample)) {

            log.info("Using the sample database");
            connectionDetails.setEndpoint(sampleEndpoint);
            connectionDetails.setPassword(samplePassword);
            connectionDetails.setUser(sampleUser);
            connectionDetails.setVendor(sampleVendor);
        }
    }
}
