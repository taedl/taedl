package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.Connection;
import com.erkoa.adhocapi.dto.Table;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface ConnectionService {
    boolean testConnection(Connection connection) throws ClassNotFoundException;
    Map<String, String> vendors();
    List<Table> tables(Connection connection) throws SQLException, ClassNotFoundException;
}
