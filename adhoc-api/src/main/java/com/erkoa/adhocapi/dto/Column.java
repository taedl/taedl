package com.erkoa.adhocapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Column {
    private String name;
    private String tableName;
    private String type;
    private String columnSize;

    public Column(String name, String tableName) {
        this.name = name;
        this.tableName = tableName;
    }
}
