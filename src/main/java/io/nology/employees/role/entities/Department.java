package io.nology.employees.role.entities;

import com.fasterxml.jackson.annotation.JsonValue;

public enum Department {
    ENGINEERING("Engineering"),
    QUALITY_ASSURANCE("Quality Assurance"),
    DESIGN("Design"),
    PRODUCT("Product"),
    HUMAN_RESOURCES("Human Resources");

    private final String label;

    Department(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}