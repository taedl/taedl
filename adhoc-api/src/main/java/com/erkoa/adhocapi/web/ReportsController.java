package com.erkoa.adhocapi.web;

import com.erkoa.adhocapi.dto.ReportRequest;
import com.erkoa.adhocapi.dto.Table;
import com.erkoa.adhocapi.services.ConnectionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/reports")
public class ReportsController {

    private final ConnectionService connectionService;

    @Autowired
    public ReportsController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @PostMapping(value = "/table", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Table> table(@RequestBody ReportRequest reportRequest) {
        return null;
    }
}
