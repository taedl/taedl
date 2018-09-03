package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.Connection;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.DriverManager;
import java.util.*;
import java.util.stream.Collectors;

@Log4j2
@Service
public class RdConnectionService implements ConnectionService {

    private final String supportedDrivers;

    @Autowired
    public RdConnectionService(@Value("${packaged.jdbc.driver.classes}") String supportedDrivers) {
        this.supportedDrivers = supportedDrivers;
    }


    @Override
    public boolean testConnection(Connection connection) throws ClassNotFoundException {
        Class.forName(vendors().get(connection.getVendor()));
        boolean flag = false;
        try (java.sql.Connection conn = DriverManager.getConnection(connection.getEndpoint(), connection.getUser(), connection.getPassword())) {
            if (conn != null) {
                flag = true;
            }
        } catch (Exception ignored) {

        }
        return flag;
    }

    @Override
    public Map<String, String> vendors() {
        List<String> pairs = Arrays.asList(supportedDrivers.split(","));
        Map<String, String> vendors = new HashMap<>();
        pairs.forEach(item -> {
            String key = item.split("\\|")[0];
            String val = item.split("\\|")[1];
            vendors.put(key, val);
        });
        return vendors;
    }
}
