package com.erkoa.adhocapi.dto;

import com.erkoa.adhocapi.exceptions.QueryBuildingException;

public enum FilterCondition {
    LESS, LESS_OR_EQUAL, GREATER_OR_EQUAL, GREATER, EQUALS,
    STRING_EQUALS, STRING_STARTS_WITH, STRING_ENDS_WITH, STRING_CONTAINS,
    DATE_LESS, DATE_LESS_OR_EQUAL, DATE_GREATER_OR_EQUAL, DATE_GREATER, DATE_EQUALS;

    @Override
    public String toString() {
        switch (this) {
            case LESS:
                return "<";
            case LESS_OR_EQUAL:
                return "<=";
            case GREATER_OR_EQUAL:
                return ">=";
            case GREATER:
                return ">";
            case EQUALS:
                return "=";
            case STRING_EQUALS:
                return "=";
            case STRING_STARTS_WITH:
                return "will error";
            case STRING_ENDS_WITH:
                return "will error";
            case STRING_CONTAINS:
                return "will error";
            case DATE_LESS:
                return "<";
            case DATE_LESS_OR_EQUAL:
                return "<=";
            case DATE_GREATER_OR_EQUAL:
                return ">=";
            case DATE_GREATER:
                return ">";
            case DATE_EQUALS:
                return "=";
            default:
                throw new QueryBuildingException("Unrecognised filter type" + this);
        }
    }
}
