package io.nology.employees.role.entities;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SeniorityLevel {
    JUNIOR("Junior"),
    MID("Mid"),
    SENIOR("Senior"),
    LEAD("Lead"),
    PRINCIPAL("Principal");

    private final String label;

    SeniorityLevel(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}
