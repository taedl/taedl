package com.erkoa.adhocapi.web;

import com.erkoa.adhocapi.dto.*;
import com.erkoa.adhocapi.services.ConnectionService;
import com.erkoa.adhocapi.services.QueryBuildingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/connections")
public class ConnectionsController {

    private final ConnectionService connectionService;
    private final QueryBuildingService queryBuildingService;

    @Autowired
    public ConnectionsController(ConnectionService connectionService, QueryBuildingService queryBuildingService) {
        this.connectionService = connectionService;
        this.queryBuildingService = queryBuildingService;
    }

    @GetMapping(value = "/vendors", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> getSupportedVendors() {
        return new ResponseEntity<>(connectionService.vendors(), HttpStatus.OK);
    }


    @PostMapping(value = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ConnectionDetails> connect(@RequestBody ConnectionDetails connectionDetails) throws ClassNotFoundException {
        if (connectionService.testConnection(connectionDetails)) {
            return new ResponseEntity<>(connectionDetails, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = "/tables-metadata", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<TableMetaData>> tablesMetaData(@RequestBody ConnectionDetails connectionDetails) throws SQLException, ClassNotFoundException {
        return new ResponseEntity<>(connectionService.tables(connectionDetails), HttpStatus.OK);
    }

    @PostMapping(value = "/tables", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> tables(@RequestBody ConnectionDetails connectionDetails) throws SQLException, ClassNotFoundException {
        return new ResponseEntity<>(connectionService.tables(connectionDetails).stream().map(TableMetaData::getName).collect(Collectors.toList()), HttpStatus.OK);
    }

    @PostMapping(value = "/preview", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PreviewResponse> preview(@RequestBody PreviewRequest previewRequest) throws SQLException, ClassNotFoundException {
        ConnectionDetails connectionDetails = previewRequest.getConnection();
        List<TableMetaData> tables = previewRequest.getTables();
        if (connectionDetails == null || CollectionUtils.isEmpty(tables)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        PreviewResponse response = new PreviewResponse(connectionService.preview(connectionDetails, tables, previewRequest.getJoins()),
                queryBuildingService.joinChain(tables, previewRequest.getJoins()));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
