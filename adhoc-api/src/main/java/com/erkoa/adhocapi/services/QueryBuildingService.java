package com.erkoa.adhocapi.services;

import com.erkoa.adhocapi.dto.Join;
import com.erkoa.adhocapi.dto.TableMetaData;

import java.util.List;
import java.util.Set;

public interface QueryBuildingService {
    String generatePreviewQuery(List<TableMetaData> tables, List<Join> joins);
    Set<String> joinChain(List<TableMetaData> tables, List<Join> joins);
}
