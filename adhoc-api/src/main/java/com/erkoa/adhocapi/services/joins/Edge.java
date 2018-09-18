package com.erkoa.adhocapi.services.joins;

import com.erkoa.adhocapi.dto.Join;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Edge {
    private Vertex source;
    private Vertex destination;
    private Join join;
}
