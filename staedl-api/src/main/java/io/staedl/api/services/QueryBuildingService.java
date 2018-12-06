package io.staedl.api.services;

import io.staedl.api.dto.*;

import java.util.List;
import java.util.Set;

public interface QueryBuildingService {
    String generatePreviewQuery(List<TableMetaData> tables, List<Join> joins, String vendor);
    Set<String> joinChain(List<TableMetaData> tables, List<Join> joins);
    String generateTableQuery(List<TableMetaData> tables, List<Column> columns, List<AggregatedColumn> aggregatedColumns,
                              List<Join> joins, List<Filter> filters, String vendor);
}
