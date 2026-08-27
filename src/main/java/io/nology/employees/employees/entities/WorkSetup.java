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
    public static WorkSetup fromLabel(String label) {
        if (label == null) {
            return null;
        }
        for (WorkSetup workSetup : WorkSetup.values()) {
            if (workSetup.getLabel().equalsIgnoreCase(label.trim())) {
                return workSetup;
            }
        }
        throw new IllegalArgumentException("Unknown work setup label: " + label);
    }
}
