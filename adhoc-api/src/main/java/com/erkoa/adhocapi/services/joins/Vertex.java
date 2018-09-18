package com.erkoa.adhocapi.services.joins;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
@AllArgsConstructor
public class Vertex {
    private String name;
    private String tableName;
}
