package io.nology.employees.role.dtos;

import io.nology.employees.role.entities.SeniorityLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateRoleRequest {
    @NotBlank(message = "Role name cannot be empty")
    private String name;

    @NotNull(message = "Seniority level is required")
    private SeniorityLevel seniorityLevel;

    public CreateRoleRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SeniorityLevel getSeniorityLevel() {
        return seniorityLevel;
    }

    public void setSeniorityLevel(SeniorityLevel seniorityLevel) {
        this.seniorityLevel = seniorityLevel;
    }

}
