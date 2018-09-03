package com.erkoa.adhocapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Table {
    private String name;
    private Column primaryKey;
    private List<Map<String, Column>> importedKeys;
    private List<Map<String, Column>> exportedKeys;
    private List<Column> columns;
}
