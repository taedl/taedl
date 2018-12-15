package io.taedl.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TableMetaData {
    private String name;
    private Column primaryKey;
    private List<Map<String, Column>> importedKeys;
    private List<Map<String, Column>> exportedKeys;
    private List<Column> columns;

    public TableMetaData(String name) {
        this.name = name;
    }
}
