package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.AggregatedColumn;
import com.erkoa.adhocapi.dto.Column;
import com.erkoa.adhocapi.dto.Join;
import com.erkoa.adhocapi.dto.TableMetaData;

import java.util.List;
import java.util.Set;

public interface QueryBuildingService {
    String generatePreviewQuery(List<TableMetaData> tables, List<Join> joins, String vendor);
    Set<String> joinChain(List<TableMetaData> tables, List<Join> joins);
    String generateTableQuery(List<TableMetaData> tables, List<Column> columns, List<AggregatedColumn> aggregatedColumns, List<Join> joins);
}
