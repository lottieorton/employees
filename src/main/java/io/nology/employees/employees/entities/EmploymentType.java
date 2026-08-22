package io.nology.employees.employees.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum EmploymentType {
    FULL_TIME_PERMANENT("Full-Time Permanent"),
    PART_TIME_PERMANENT("Part-Time Permanent"),
    CONTRACTOR("Contractor");

    private final String label;

    EmploymentType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static EmploymentType fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        for (EmploymentType type : EmploymentType.values()) {
            if (type.name().equalsIgnoreCase(value.trim()) || type.getLabel().equalsIgnoreCase(value.trim())) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown employment type: " + value);
    }
}