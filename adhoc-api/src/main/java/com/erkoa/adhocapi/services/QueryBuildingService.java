package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.ConnectionDetails;
import com.erkoa.adhocapi.dto.Join;
import com.erkoa.adhocapi.dto.TableMetaData;

import java.util.List;

public interface QueryBuildingService {
    String generatePreviewQuery(List<TableMetaData> tables, List<Join> joins);
    List<String> joinChain(List<TableMetaData> tables, List<Join> joins);
}
