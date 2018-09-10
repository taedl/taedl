package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.Column;
import com.erkoa.adhocapi.dto.ConnectionDetails;
import com.erkoa.adhocapi.dto.TableMetaData;
import com.erkoa.adhocapi.exceptions.QueryBuildingException;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RdQueryBuildingService implements QueryBuildingService {

    private final String FROM = "from";
    private final String SELECT = "select";
    private final String END = ";";

    @Override
    public String generatePreviewQuery(ConnectionDetails connectionDetails, List<TableMetaData> tables) {
        if (CollectionUtils.isEmpty(tables)) {
            throw new QueryBuildingException("Could not generate preview query, no tables provided");
        }

        // TODO: for now only
        if (tables.size() > 1) {
            return null;
        }

        return select(tables.get(0).getColumns()) + from(tables.get(0).getName()) + finalise();
    }

    //TODO: consider doing "select as" - will be easier extracting data form resultset this way
    private String select(List<Column> columns) {
        return padRight(SELECT) +
                columns.stream().map(column -> column.getTableName().concat(".").concat(column.getName())).collect(Collectors.joining(", "));
    }

    private String from(String table) {
        return pad(FROM) + table;
    }

    private String finalise() {
        return END;
    }

    private String pad() {
        return " ";
    }

    private String pad(String text) {
        return text.isEmpty() ? " " : " ".concat(text).concat(" ");
    }

    private String padLeft(String text) {
        return text.isEmpty() ? " " : " ".concat(text);
    }

    private String padRight(String text) {
        return text.isEmpty() ? " " : text.concat(" ");
    }

}
