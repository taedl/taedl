package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.Column;
import com.erkoa.adhocapi.dto.Connection;
import com.erkoa.adhocapi.dto.Table;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Service
public class RdConnectionService implements ConnectionService {

    private final String supportedDrivers;

    @Autowired
    public RdConnectionService(@Value("${packaged.jdbc.driver.classes}") String supportedDrivers) {
        this.supportedDrivers = supportedDrivers;
    }


    @Override
    public boolean testConnection(Connection connection) throws ClassNotFoundException {
        Class.forName(vendors().get(connection.getVendor()));
        boolean flag = false;
        try (java.sql.Connection conn = DriverManager.getConnection(connection.getEndpoint(), connection.getUser(), connection.getPassword())) {
            if (conn != null) {
                flag = true;
            }
        } catch (Exception ignored) {

        }
        return flag;
    }

    @Override
    public Map<String, String> vendors() {
        List<String> pairs = Arrays.asList(supportedDrivers.split(","));
        Map<String, String> vendors = new HashMap<>();
        pairs.forEach(item -> {
            String key = item.split("\\|")[0];
            String val = item.split("\\|")[1];
            vendors.put(key, val);
        });
        return vendors;
    }

    @Override
    public List<Table> tables(Connection connection) throws SQLException, ClassNotFoundException {
        java.sql.Connection conn = null;
        try {
            Class.forName(vendors().get(connection.getVendor()));
            conn = DriverManager.getConnection(connection.getEndpoint(), connection.getUser(), connection.getPassword());
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
            List<Table> tables = new ArrayList<>();
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

    // TODO: messy, needs refactoring
    private Table generateSchema(DatabaseMetaData metaData, String tableName) throws SQLException {
        Table table = new Table();
        table.setName(tableName);

        // TODO: catalogue and schema must be configurable - they will not always be default
        ResultSet primaryKeys = metaData.getPrimaryKeys(null, null, tableName);
        if (primaryKeys != null) {
            primaryKeys.next();
            try {
                Column key = new Column(primaryKeys.getString(4), tableName, null, null);
                table.setPrimaryKey(key);
            } catch (Exception ignoring) {
                log.warn("Could not extract primary key for table {}", tableName);
            }
            primaryKeys.close();
        }

        ResultSet importedForeignKeys = metaData.getImportedKeys(null, null, tableName);
        table.setForeignKeys(new ArrayList<>());
        while (importedForeignKeys.next()) {
            try {
                String fkTableName = importedForeignKeys.getString("FKTABLE_NAME");
                String fkColumnName = importedForeignKeys.getString("FKCOLUMN_NAME");

                String pkTableName = importedForeignKeys.getString("PKTABLE_NAME");
                String pkColumnName = importedForeignKeys.getString("PKCOLUMN_NAME");

                Column key = new Column(fkColumnName, fkTableName, null, null);
                table.getForeignKeys().add(key);
            } catch (Exception ignoring) {
                log.warn("Could not extract foreign keys for table {}", tableName);
            }
        }
        importedForeignKeys.close();

        ResultSet columns = metaData.getColumns(null, null, tableName, null);
        table.setColumns(new ArrayList<>());

        while (columns.next()) {
            table.getColumns().add(
                    new Column(columns.getString("COLUMN_NAME"), tableName, columns.getString("TYPE_NAME"),
                            columns.getString("COLUMN_SIZE")));
        }
        columns.close();
        return table;
    }
}
