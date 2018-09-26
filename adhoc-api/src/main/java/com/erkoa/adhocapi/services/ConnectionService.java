package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.*;

import java.sql.SQLException;
import java.util.List;

public interface ConnectionService {
    boolean testConnection(ConnectionDetails connectionDetails) throws ClassNotFoundException;
    List<String> vendors();
    List<TableMetaData> tables(ConnectionDetails connectionDetails) throws SQLException, ClassNotFoundException;
    Table preview(ConnectionDetails connectionDetails, List<TableMetaData> tables, List<Join> joins) throws ClassNotFoundException, SQLException;
    Table tableReport(ConnectionDetails connectionDetails, List<TableMetaData> tables, List<Column> columns, List<AggregatedColumn> rows, List<Join> joins) throws ClassNotFoundException, SQLException;
}
