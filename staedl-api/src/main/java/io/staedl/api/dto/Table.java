package io.staedl.api.dto;

import lombok.Data;
import org.springframework.util.StringUtils;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Data
public class Table {
    private List<String> headers;
    private List<List<Object>> data;
    public Table(ResultSet resultSet, ResultSetMetaData metaData, List<TableMetaData> tables) throws SQLException {
        headers(metaData);
        data(resultSet, metaData);
    }

    private void headers(ResultSetMetaData resultSetMetaData) throws SQLException {
        headers = new ArrayList<>();
        for (int i = 1; i <= resultSetMetaData.getColumnCount(); i++) {
            String dbColumn = resultSetMetaData.getColumnLabel(i);
            String dbTable = resultSetMetaData.getTableName(i);

            if (dbColumn.contains("$$$") && StringUtils.isEmpty(dbTable)) {
                String res = dbColumn.replaceFirst("\\$\\$\\$", "(");
                res = res.replaceFirst("\\$\\$\\$", ".");
                res = res.replaceFirst("\\$\\$\\$", ")");
                headers.add(res);
            } else {
                headers.add(dbTable + "." + dbColumn);
            }
        }
    }

    private void data(ResultSet resultSet, ResultSetMetaData resultSetMetaData) throws SQLException {
        if (resultSet == null) {
            return;
        }
        data = new ArrayList<>();
        while(resultSet.next()) {
            List<Object> row = new ArrayList<>();
            for (int i = 1; i <= resultSet.getMetaData().getColumnCount(); i++) {
                // JDBC would return first value if there are equal column names (although from different tables) in result set
                // so should either have a quiery with "as" or use index (less safe??)
                //  String columnLabel = meta.getColumnLabel(i);
                int type = resultSetMetaData.getColumnType(i);

                //TODO: replace with SWITCH & cater for other instances
                if (type == 4){
                    Integer value = resultSet.getInt(i);
                    row.add(value);
                } else {
                    String value = resultSet.getString(i);
                    row.add(value);
                }
            }
            data.add(row);
        }
        resultSet.close();
    }
}
