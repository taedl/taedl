package com.erkoa.adhocapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Table {
    private List<String> headers;
    private List<List<Object>> data;
}
