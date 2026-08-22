package io.nology.employees.role.dtos;

import io.nology.employees.role.entities.Department;
import io.nology.employees.role.entities.SeniorityLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateRoleRequest {
    @NotBlank(message = "Role name cannot be empty")
    private String name;

    @NotNull(message = "Seniority level is required")
    private SeniorityLevel seniorityLevel;

    @NotNull(message = "Department is required")
    private Department department;

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

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

}
