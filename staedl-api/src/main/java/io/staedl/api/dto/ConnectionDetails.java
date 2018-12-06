package io.staedl.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionDetails {
    private String endpoint;
    private String user;
    private String password;
    private String vendor;
}
