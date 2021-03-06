package io.taedl.api.services.joins;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Graph {
    private List<Vertex> vertices;
    private List<Edge> edges;
}
