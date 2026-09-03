package io.nology.employees.employees.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum WorkSetup {
    ON_SITE("Onsite"),
    HYBRID("Hybrid"),
    REMOTE("Remote");

    private final String label;

    private WorkSetup(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static WorkSetup fromLabel(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        for (WorkSetup workSetup : WorkSetup.values()) {
            if (workSetup.label.equalsIgnoreCase(value.trim()) || workSetup.name().equalsIgnoreCase(value.trim())) {
                return workSetup;
            }
        }
        throw new IllegalArgumentException("Unknown work setup: " + value);
    }
};