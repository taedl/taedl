package io.taedl.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class PreviewRequest {
   ConnectionDetails connection;
   List<TableMetaData> tables;
   List<Join> joins;
}
