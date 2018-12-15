package io.taedl.api.dto;

import io.taedl.api.exceptions.QueryBuildingException;

public enum JoinType {
    inner, left, right, outer;

    @Override
    public String toString() {
        switch (this) {
            case inner:
                return "inner join";
            case left:
                return "left join";
            case right:
                return "right join";
            case outer:
                return "full outer join";
            default:
                throw new QueryBuildingException("Unrecognised join type" + this);
        }
    }
}
