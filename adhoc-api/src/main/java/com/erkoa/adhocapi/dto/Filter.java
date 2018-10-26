package com.erkoa.adhocapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Filter {
    private Column column;
    private FilterCondition condition;
    private String constant;
}