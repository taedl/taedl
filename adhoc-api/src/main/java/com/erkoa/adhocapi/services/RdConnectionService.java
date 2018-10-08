package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.*;
import com.google.common.collect.ImmutableMap;
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

    @Autowired
    public RdConnectionService(@Value("${packaged.jdbc.driver.classes}") String supportedDrivers, QueryBuildingService queryBuildingService) {
        this.supportedDrivers = supportedDrivers;
        this.queryBuildingService = queryBuildingService;
    }


    @Override
    public boolean testConnection(ConnectionDetails connectionDetails) throws ClassNotFoundException {
        boolean flag = false;
        try (java.sql.Connection conn = DriverManager.getConnection(connectionDetails.getEndpoint(), connectionDetails.getUser(), connectionDetails.getPassword())) {
            if (conn != null) {
                flag = true;
            }
        } catch (Exception ignored) {

        }
        return flag;
    }

    @Override
    public List<String> vendors() {
        List<String> pairs = Arrays.asList(supportedDrivers.split(","));
        return pairs.stream().map(item -> item.split("\\|")[0]).collect(Collectors.toList());
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
        try (Connection conn = DriverManager.getConnection(connectionDetails.getEndpoint(), connectionDetails.getUser(), connectionDetails.getPassword())) {
            DatabaseMetaData metaData = conn.getMetaData();

            // TODO: catalogue and schema are not always default
            String catalog = null;
            String schemaPattern = null;
            String tableNamePattern = null;
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
        String query = queryBuildingService.generatePreviewQuery(tables, joins);
        log.info("Generated preview query: {}", query);
        return createTable(connectionDetails, tables, query);
    }

    @Override
    public Table tableReport(ConnectionDetails connectionDetails, List<TableMetaData> tables, List<Column> columns, List<AggregatedColumn> rows, List<Join> joins) throws ClassNotFoundException, SQLException {
        String query = queryBuildingService.generateTableQuery(tables, columns, rows, joins);
        log.info("Generated table query: {}", query);
        List<TableMetaData> tablesToJoin = tables.stream().filter(t -> !Collections.disjoint(t.getColumns(), columns)).collect(Collectors.toList());
        return createTable(connectionDetails, tablesToJoin, query);
    }

    private Table createTable(ConnectionDetails connectionDetails, List<TableMetaData> tables, String query) throws SQLException {
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
}
