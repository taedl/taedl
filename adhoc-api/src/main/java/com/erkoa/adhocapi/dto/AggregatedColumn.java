package com.erkoa.adhocapi.dto;

import lombok.Data;

@Data
public class AggregatedColumn {
    private Column column;
    private Aggregation aggregation;
}
