package io.staedl.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AggregatedColumn {
    private Column column;
    private Aggregation aggregation;
}
