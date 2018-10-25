package com.erkoa.adhocapi.dto;

import lombok.Data;
import java.util.List;


@Data
public class ReportRequest {
    ConnectionDetails connection;
    List<TableMetaData> tables;
    List<Column> columns;
    List<AggregatedColumn> rows;
    List<Join> joins;
    List<Filter> filters;
}
