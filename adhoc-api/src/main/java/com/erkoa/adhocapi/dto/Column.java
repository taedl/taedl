package com.erkoa.adhocapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Column {
    String name;
    String tableName;
    String type;
    String columnSize;
}
