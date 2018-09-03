package com.erkoa.adhocapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Table {
    private String name;
    private Column primaryKey;
    private List<Column> foreignKeys;
    private List<Column> columns;
}
