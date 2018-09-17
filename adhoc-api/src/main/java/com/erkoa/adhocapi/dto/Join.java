package com.erkoa.adhocapi.dto;

import lombok.Data;

@Data
public class Join {
    private Column primaryKey;
    private Column foreignKey;
    private JoinType type;
}
