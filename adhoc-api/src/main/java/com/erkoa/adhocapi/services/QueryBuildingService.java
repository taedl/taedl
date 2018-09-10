package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.ConnectionDetails;
import com.erkoa.adhocapi.dto.TableMetaData;

import java.util.List;

public interface QueryBuildingService {
    String generatePreviewQuery(ConnectionDetails connectionDetails, List<TableMetaData> tables);
}
