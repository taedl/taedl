package io.staedl.api.dto;

public enum Aggregation {
    COUNT, SUM, AVG, MIN, MAX;

    public String insertable() {
        String insertable = new String();
        switch (this) {
            case COUNT:
                insertable = "count";
                break;
            case SUM:
                insertable = "sum";
                break;
            case AVG:
                insertable = "avg";
                break;
            case MIN:
                insertable = "min";
                break;
            case MAX:
                insertable = "max";
                break;
        }
        return insertable;
    }
}
