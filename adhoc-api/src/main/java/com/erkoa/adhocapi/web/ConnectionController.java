package com.erkoa.adhocapi.web;

import com.erkoa.adhocapi.dto.Connection;
import com.erkoa.adhocapi.services.ConnectionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/connections")
public class ConnectionController {

    private final ConnectionService connectionService;

    @Autowired
    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping(value = "/vendors", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> getSupportedVendors() {
        return new ResponseEntity<>(connectionService.vendors(), HttpStatus.OK);
    }


    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Connection> connect(@RequestBody Connection connection) throws ClassNotFoundException {
        if (connectionService.testConnection(connection)) {
            return new ResponseEntity<>(connection, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
