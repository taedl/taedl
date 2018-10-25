package com.erkoa.adhocapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Filter {
    Column column;
}

//constructor(public column: IColumn, public condition?: string, public constant?: string)