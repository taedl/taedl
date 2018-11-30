package com.erkoa.adhocapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Filter {
    private Column column;
    private FilterCondition condition;
    private String constant;
}