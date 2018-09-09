package com.erkoa.adhocapi.web;

import com.erkoa.adhocapi.dto.Connection;
import com.erkoa.adhocapi.dto.Table;
import com.erkoa.adhocapi.services.ConnectionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping("/domains")
public class DomainsController {

    private final ConnectionService connectionService;

    @Autowired
    public DomainsController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @PostMapping(value = "/preview/tables/{tables}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Table> preview(@RequestBody Connection connection, @PathVariable String tables) {
        if (StringUtils.isEmpty(tables)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<String> tablesList = Arrays.asList(tables.split(","));
        return new ResponseEntity<>(connectionService.preview(connection, tablesList), HttpStatus.OK);
    }
}
