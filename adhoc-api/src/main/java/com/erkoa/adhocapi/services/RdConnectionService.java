package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.Column;
import com.erkoa.adhocapi.dto.ConnectionDetails;
import com.erkoa.adhocapi.dto.Table;
import com.erkoa.adhocapi.dto.TableMetaData;
import com.google.common.collect.ImmutableMap;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
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
        Class.forName(driver(connectionDetails.getVendor()));
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
    public List<TableMetaData> tables(ConnectionDetails connectionDetails) throws SQLException, ClassNotFoundException {
        Connection conn = null;
        try {
            Class.forName(driver(connectionDetails.getVendor()));
            conn = DriverManager.getConnection(connectionDetails.getEndpoint(), connectionDetails.getUser(), connectionDetails.getPassword());
            DatabaseMetaData metaData = conn.getMetaData();

            String   catalog          = null;
            String   schemaPattern    = null;
            String   tableNamePattern = null;

            // Not using views to have keys
            String[] types            = {"TABLE"};

            ResultSet result = metaData.getTables(catalog, schemaPattern, tableNamePattern, types);

            List<String> tableList = new ArrayList<>();
            while(result.next()) {
                tableList.add(result.getString(3));
            }
            result.close();
            List<TableMetaData> tables = new ArrayList<>();
            for (String table : tableList) {
                tables.add(generateSchema(metaData, table));
            }
            return tables;

        } finally {
            if (conn != null) {
                conn.close();
            }
        }
    }

    @Override
    public Table preview(ConnectionDetails connectionDetails, List<TableMetaData> tables) throws ClassNotFoundException, SQLException {
        String query = queryBuildingService.generatePreviewQuery(connectionDetails, tables);

        Connection conn = null;
        Table table = null;
        try {
            Class.forName(driver(connectionDetails.getVendor()));
            conn = DriverManager.getConnection(connectionDetails.getEndpoint(), connectionDetails.getUser(), connectionDetails.getPassword());
            PreparedStatement preparedStatement = conn.prepareStatement(query);
            ResultSet resultSet = preparedStatement.executeQuery();
            ResultSetMetaData meta = resultSet.getMetaData();
            table = new Table(resultSet, meta, tables);

        } finally {
            if (conn != null) {
                conn.close();
            }
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
