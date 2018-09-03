package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.Connection;

import java.util.Map;

public interface ConnectionService {
    boolean testConnection(Connection connection) throws ClassNotFoundException;
    Map<String, String> vendors();
}
