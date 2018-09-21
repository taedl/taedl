package com.erkoa.adhocapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class PreviewResponse {
    private Table table;
    private Set<String> joinChain;
}
