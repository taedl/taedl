package io.taedl.api.utils;

import io.taedl.api.exceptions.FormatConversionException;
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
