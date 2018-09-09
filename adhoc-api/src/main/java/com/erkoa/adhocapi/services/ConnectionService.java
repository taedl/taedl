package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.Connection;
import com.erkoa.adhocapi.dto.Table;
import com.erkoa.adhocapi.dto.TableMetaData;

import java.sql.SQLException;
import java.util.List;

public interface ConnectionService {
    boolean testConnection(Connection connection) throws ClassNotFoundException;
    List<String> vendors();
    List<TableMetaData> tables(Connection connection) throws SQLException, ClassNotFoundException;
    Table preview(Connection connection, List<String> tables);
}
