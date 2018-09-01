package com.erkoa.adhocapi.utils;

import com.erkoa.adhocapi.exceptions.FormatConversionException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ConversionUtils {
    private static ObjectMapper mapper = new ObjectMapper();

    public static String toJsonString(Object object) {
        try {
            return mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new FormatConversionException("Failed conversion to JSON");
        }
    }
}
