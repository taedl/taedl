package io.taedl.api.services.joins;

import io.taedl.api.dto.Join;
import io.taedl.api.exceptions.QueryBuildingException;
import org.apache.commons.lang3.tuple.ImmutablePair;

import java.util.*;

public class Joiner {
    private List<Edge> edges;
    private List<Vertex> vertices;

    private Set<Vertex> visited;
    private Set<Vertex> notVisited;

    private Map<Vertex, ImmutablePair<Vertex, Join>> typedPredecessors;
    private Map<Vertex, Integer> distance;

    public Joiner(Graph graph, Vertex start) {
        this.edges = graph.getEdges();
        this.vertices = graph.getVertices();
        this.build(start);
    }

    private void build(Vertex source) {
        visited = new HashSet<>();
        notVisited = new HashSet<>();
        distance = new HashMap<>();
        typedPredecessors = new HashMap<>();
        distance.put(source, 0);
        notVisited.add(source);
        while (!notVisited.isEmpty()) {
            Vertex node = getMinimum(notVisited);
            visited.add(node);
            notVisited.remove(node);
            calculateDistances(node);
        }
    }

    private void calculateDistances(Vertex node) {
        List<Vertex> adjacentNodes = getNeighbors(node);
        for (Vertex target : adjacentNodes) {
            if (getShortestDistance(target) > getShortestDistance(node) + 1) {
                distance.put(target, getShortestDistance(node) + 1);
                notVisited.add(target);
                Join join = findJoin(node, target);
                typedPredecessors.put(target, new ImmutablePair<>(node, join));
            }
        }
    }

    private Join findJoin(Vertex source, Vertex target) {
        for (Edge edge: edges) {
            if (edge.getSource().equals(source) && edge.getDestination().equals(target)) {
                return edge.getJoin();
            }
        }
        throw new QueryBuildingException("Could not get join type for " + source + " and "+  target);
    }

    private List<Vertex> getNeighbors(Vertex node) {
        List<Vertex> neighbors = new ArrayList<>();
        for (Edge edge : edges) {
            if (edge.getSource().equals(node) && !isVisited(edge.getDestination())) {
                neighbors.add(edge.getDestination());
            }
        }
        return neighbors;
    }

    private boolean isVisited(Vertex vertex) {
        return visited.contains(vertex);
    }

    private Vertex getMinimum(Set<Vertex> vertexes) {
        Vertex minimum = null;
        for (Vertex vertex : vertexes) {
            if (minimum == null) {
                minimum = vertex;
            } else {
                if (getShortestDistance(vertex) < getShortestDistance(minimum)) {
                    minimum = vertex;
                }
            }
        }
        return minimum;
    }

    private int getShortestDistance(Vertex destination) {
        Integer d = distance.get(destination);
        if (d == null) {
            return Integer.MAX_VALUE;
        } else {
            return d;
        }
    }

    public List<ImmutablePair<Vertex, Join>> getJoinChain(Vertex target) {
        List<ImmutablePair<Vertex, Join>> joinedPath = new ArrayList<>();
        Vertex step = target;
        //is there path?
        if (typedPredecessors.get(step) == null) {
            return null;
        }

        joinedPath.add(new ImmutablePair<>(step, typedPredecessors.get(step).right));
        while (typedPredecessors.get(step) != null) {
            step = typedPredecessors.get(step).left;
            Join join = typedPredecessors.get(step) != null ? typedPredecessors.get(step).right : null;
            joinedPath.add(new ImmutablePair<>(step, join));
        }

        Collections.reverse(joinedPath);
        return joinedPath;
    }
}
