package com.erkoa.adhocapi.dto;

import com.erkoa.adhocapi.exceptions.QueryBuildingException;

public enum FilterCondition {
    LESS, LESS_OR_EQUAL, GREATER_OR_EQUAL, GREATER, EQUALS, STRING_EQUALS, STRING_STARTS_WITH, STRING_ENDS_WITH, STRING_CONTAINS;

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
            default:
                throw new QueryBuildingException("Unrecognised filter type" + this);
        }
    }
}
