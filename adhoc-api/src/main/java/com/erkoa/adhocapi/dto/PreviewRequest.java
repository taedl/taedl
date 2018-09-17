package com.erkoa.adhocapi.dto;

import lombok.Data;

import java.util.List;

@Data
public class PreviewRequest {
   ConnectionDetails connection;
   List<TableMetaData> tables;
   List<Join> joins;
}
