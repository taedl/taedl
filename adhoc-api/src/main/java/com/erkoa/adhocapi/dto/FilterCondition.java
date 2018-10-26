package com.erkoa.adhocapi.dto;

import com.erkoa.adhocapi.exceptions.QueryBuildingException;

public enum FilterCondition {
    LESS, LESS_OR_EQUAL, GREATER_OR_EQUAL, GREATER, EQUALS, STARTS_WITH, ENDS_WITH, CONTAINS;

    @Override
    public String toString() {
        switch (this) {
            case LESS:
                return "<";
            case LESS_OR_EQUAL:
                return "<=";
            case GREATER_OR_EQUAL:
                return ">";
            case GREATER:
                return ">";
            case EQUALS:
                return "=";
            case STARTS_WITH:
                return "will error";
            case ENDS_WITH:
                return "will error";
            case CONTAINS:
                return "will error";
            default:
                throw new QueryBuildingException("Unrecognised filter type" + this);
        }
    }
}
