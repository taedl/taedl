package io.taedl.api.services.joins;

import io.taedl.api.dto.Join;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Edge {
    private Vertex source;
    private Vertex destination;
    private Join join;
}
