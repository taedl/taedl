package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.ConnectionDetails;
import com.erkoa.adhocapi.dto.Join;
import com.erkoa.adhocapi.dto.Table;
import com.erkoa.adhocapi.dto.TableMetaData;

import java.sql.SQLException;
import java.util.List;

public interface ConnectionService {
    boolean testConnection(ConnectionDetails connectionDetails) throws ClassNotFoundException;
    List<String> vendors();
    List<TableMetaData> tables(ConnectionDetails connectionDetails) throws SQLException, ClassNotFoundException;
    Table preview(ConnectionDetails connectionDetails, List<TableMetaData> tables, List<Join> joins) throws ClassNotFoundException, SQLException;
}
