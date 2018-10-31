package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.*;
import com.erkoa.adhocapi.exceptions.QueryBuildingException;
import com.erkoa.adhocapi.services.joins.Edge;
import com.erkoa.adhocapi.services.joins.Graph;
import com.erkoa.adhocapi.services.joins.Joiner;
import com.erkoa.adhocapi.services.joins.Vertex;
import com.google.common.collect.ImmutableSet;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RdQueryBuildingService implements QueryBuildingService {

    private final String FROM = "from";
    private final String SELECT = "select";
    private final String END = ";";

    private final String AGGREGATION_DELIMITER = "$$$";

    @Override
    public String generatePreviewQuery(List<TableMetaData> tables, List<Join> joins, String vendor) {
        if (CollectionUtils.isEmpty(tables)) {
            throw new QueryBuildingException("Could not generate preview query, no tables provided");
        }

        return select(tables.stream().flatMap(table -> table.getColumns().stream()).collect(Collectors.toList()), null) + from(tables, joins, null) + finalise();
    }

    @Override
    public Set<String> joinChain(List<TableMetaData> tables, List<Join> joins) {
        Set<String> tablesList = new LinkedHashSet<>();
        List<Column> columns = tables.stream().map(TableMetaData::getColumns).flatMap(Collection::stream).collect(Collectors.toList());

        if (!isJoined(columns)) {
            return ImmutableSet.of(columns.get(0).getTableName());
        }

        List<Vertex> vertices = joins.stream().map(item ->
                new Vertex(item.getPrimaryKey().getTableName())).collect(Collectors.toList());

        vertices.addAll(joins.stream().map(item ->
                new Vertex(item.getForeignKey().getTableName())).collect(Collectors.toList()));

        vertices = vertices.stream().distinct().collect(Collectors.toList());

        List<TableMetaData> tablesToJoin = tables.stream().distinct().collect(Collectors.toList());
        Joiner joiner = createJoiner(vertices, tablesToJoin, joins);
        List<List<ImmutablePair<Vertex, Join>>> joinChains = new ArrayList<>(tablesToJoin.size());

        for (TableMetaData aTableToJoin : tablesToJoin) {
            Vertex current = vertices.stream().filter(v -> v.getTableName().equals(aTableToJoin.getName()))
                    .findAny().orElse(null);

            List<ImmutablePair<Vertex, Join>> chain = joiner.getJoinChain(current);
            if (chain != null) {
                joinChains.add(chain);
            }
        }

        tablesList.add((tablesToJoin.get(0).getName()));

        // TODO: wasteful, no need for the second loop here, can do above
        if (!joinChains.isEmpty()) {
            joinChains.forEach(chain -> chain.forEach(element -> {
                Join join = element.getValue();
                if (join != null) {
                    tablesList.add(join.getPrimaryKey().getTableName());
                    tablesList.add(join.getForeignKey().getTableName());
                }
            }));
        }
        return tablesList;
    }

    @Override
    public String generateTableQuery(List<TableMetaData> tables, List<Column> columns, List<AggregatedColumn> aggregatedColumns,
                                     List<Join> joins, List<Filter> filters) {
        if (CollectionUtils.isEmpty(columns)) {
            throw new QueryBuildingException("Could not generate table query, no columns provided");
        }

        List<TableMetaData> tablesToJoin = tables.stream().filter(t -> !Collections.disjoint(t.getColumns(), columns))
                .collect(Collectors.toList());

        if (!CollectionUtils.isEmpty(aggregatedColumns)) {

            List<String> tableNamesToJoin = tablesToJoin.stream().map(TableMetaData::getName).collect(Collectors.toList());

            aggregatedColumns.forEach(ac -> {
                if (!tableNamesToJoin.contains(ac.getColumn().getTableName())) {
                    TableMetaData tableToAdd = tables.stream().filter(t -> t.getName().equals(ac.getColumn().getTableName())).findFirst().orElse(null);
                    if (tableToAdd != null) {
                        tablesToJoin.add(tableToAdd);
                    }
                }
            });
        }

        return select(columns, aggregatedColumns) + from(tablesToJoin, joins, filters) + filters(filters) +
                groupBy(columns, aggregatedColumns) + orderBy(columns, aggregatedColumns) + finalise();
    }

    private String filters(List<Filter> filters) {
        String query = "";
        if (CollectionUtils.isEmpty(filters)) {
            return query;
        }

        //TODO: FIXME: constant is a string just for now
        return pad("where") + filters.stream()
                .map(filter -> {

                    String condition = "";
                    if (filter.getCondition().equals(FilterCondition.STARTS_WITH)) {
                        condition = " like '" + filter.getConstant() + "%'";
                    } else if (filter.getCondition().equals(FilterCondition.ENDS_WITH)) {
                        condition = " like '%" + filter.getConstant() + "'";
                    } else if (filter.getCondition().equals(FilterCondition.CONTAINS)) {
                        condition = " like '%" + filter.getConstant() + "%'";
                    } else {
                        condition = pad(filter.getCondition().toString()) + "'" + filter.getConstant() + "'";
                    }

                    return filter.getColumn().getTableName().concat(".")
                                    .concat(filter.getColumn().getName())
                    .concat(condition);
                })
                .collect(Collectors.joining("and "));
    }

    private String groupBy(List<Column> columns, List<AggregatedColumn> aggregatedColumns) {
        if (CollectionUtils.isEmpty(aggregatedColumns)) {
            return "";
        }
        return pad("group by") +
                columns.stream().map(column -> column.getTableName().concat(".").concat(column.getName())).collect(Collectors.joining(", "));
    }


    private String orderBy(List<Column> columns, List<AggregatedColumn> aggregatedColumns) {
        if (CollectionUtils.isEmpty(aggregatedColumns)) {
            return "";
        }

        return pad("order by")
                .concat(columns.stream().map(column -> column.getTableName().concat(".").concat(column.getName())).collect(Collectors.joining(", ")))
                .concat(", ")
                .concat(aggregatedColumns.stream().map(column ->
                        column.getAggregation().insertable().concat(AGGREGATION_DELIMITER)
                                .concat(column.getColumn().getTableName().concat(AGGREGATION_DELIMITER).concat(column.getColumn().getName()).concat(AGGREGATION_DELIMITER)))
                        .collect(Collectors.joining(", ")))
                .concat(" desc");
    }

    //TODO: consider doing "select as" - will be easier extracting data form resultset this way
    private String select(List<Column> columns, List<AggregatedColumn> aggregatedColumns) {
        String query = padRight(SELECT) +
                columns.stream().map(column -> column.getTableName().concat(".").concat(column.getName())).collect(Collectors.joining(", "));

        if (CollectionUtils.isEmpty(aggregatedColumns)) {
            return query;
        }

       return padRight(query.concat(",")) + aggregatedColumns.stream()
                .map(column -> column.getAggregation().insertable().concat("(").concat(column.getColumn().getTableName().concat(".").concat(column.getColumn().getName()).concat(")")
                        .concat(" as ").concat(column.getAggregation().insertable()).concat(AGGREGATION_DELIMITER)
                        .concat(column.getColumn().getTableName().concat(AGGREGATION_DELIMITER).concat(column.getColumn().getName()).concat(AGGREGATION_DELIMITER))
                )).collect(Collectors.joining(", "));
    }

    private Joiner createJoiner(List<Vertex> vertices, List<TableMetaData> tables, List<Join> joins) {

        List<Edge> edges = new ArrayList<>();
        for (Join join: joins) {
            edges.add(findEdge(join));
        }

        Vertex first = vertices.stream().filter(v -> v.getTableName().equals(tables.get(0).getName()))
                .findAny().orElse(null);

        if (first == null) {
            throw new QueryBuildingException("Could not find first table to join");
        }

        Graph graph = new Graph(vertices, edges);
        return new Joiner(graph, first);
    }

    private Edge findEdge(Join join) {

        Vertex start = new Vertex(join.getPrimaryKey().getTableName());
        Vertex dest = new Vertex(join.getForeignKey().getTableName());

        Join joinEdge = new Join(new Column(join.getPrimaryKey().getName(), join.getPrimaryKey().getTableName()),
                new Column(join.getForeignKey().getName(), join.getForeignKey().getTableName()), join.getType());
        return new Edge(start, dest, joinEdge);
    }

    private List<Vertex> vertices(List<Join> joins) {
        List<Vertex> vertices = joins.stream().map(item ->
                new Vertex(item.getPrimaryKey().getTableName())).collect(Collectors.toList());

        vertices.addAll(joins.stream().map(item ->
                new Vertex(item.getForeignKey().getTableName())).collect(Collectors.toList()));

        vertices = vertices.stream().distinct().collect(Collectors.toList());
        return vertices;
    }

    private String from(List<TableMetaData> tables, List<Join> joins, List<Filter> filters) {
        StringBuffer query = new StringBuffer();
        query.append(pad(FROM));
        List<Column> columns = tables.stream().map(TableMetaData::getColumns).flatMap(Collection::stream).collect(Collectors.toList());

        if (!CollectionUtils.isEmpty(filters)) {
            List<String> tableNames = tables.stream().map(TableMetaData::getName).collect(Collectors.toList());
            filters.forEach(f -> {
                if (!tableNames.contains(f.getColumn().getTableName())) {
                    tables.add(new TableMetaData(f.getColumn().getTableName()));
                }
            });
        }

        if (!isJoined(columns)) {
            return query.append(columns.get(0).getTableName()).toString();
        }

        List<Vertex> vertices = vertices(joins);

        List<TableMetaData> tablesToJoin = tables.stream().distinct().collect(Collectors.toList());
        Joiner joiner = createJoiner(vertices, tablesToJoin, joins);
        List<List<ImmutablePair<Vertex, Join>>> joinChains = new ArrayList<>(tablesToJoin.size());

        for (TableMetaData aTableToJoin : tablesToJoin) {
            Vertex current = vertices.stream().filter(v -> v.getTableName().equals(aTableToJoin.getName()))
                    .findAny().orElse(null);

            List<ImmutablePair<Vertex, Join>> chain = joiner.getJoinChain(current);
            if (chain != null) {
                joinChains.add(chain);
            }
        }

        query = query.append(tablesToJoin.get(0).getName());
        Set<ImmutablePair<Vertex, Join>> alreadyJoined = new HashSet<>();

        // TODO: wasteful, no need for the second loop here, can do above
        if (!joinChains.isEmpty()) {
            StringBuffer finalQuery = query;
            joinChains.forEach(chain -> chain.forEach(element -> {
                Vertex vertex = element.getKey();
                Join join = element.getValue();

                if (join != null && !alreadyJoined.contains(element)) {
                    finalQuery.append(pad(join.getType().toString()))
                            .append(vertex.getTableName())
                            .append(pad("on"))
                            .append(join.getPrimaryKey().getTableName()).append(".").append(join.getPrimaryKey().getName())

                            // TODO: need to add equality to Join class!
                            .append(pad("="))
                            .append(join.getForeignKey().getTableName()).append(".").append(join.getForeignKey().getName());
                    alreadyJoined.add(element);
                }

            }));
            query = finalQuery;
        }

        return query.toString();
    }

    private boolean isJoined(List<Column> columns) {
        return columns.stream().map(Column::getTableName).distinct()
                .collect(Collectors.toList()).size() != 1;
    }

    private String finalise() {
        return END;
    }

    private String pad() {
        return " ";
    }

    private String pad(String text) {
        return text.isEmpty() ? " " : " ".concat(text).concat(" ");
    }

    private String padLeft(String text) {
        return text.isEmpty() ? " " : " ".concat(text);
    }

    private String padRight(String text) {
        return text.isEmpty() ? " " : text.concat(" ");
    }

}
