package io.nology.employees.role.dtos;

import io.nology.employees.role.entities.Department;
import io.nology.employees.role.entities.SeniorityLevel;
import jakarta.validation.constraints.Pattern;

public class UpdateRoleRequest {
    @Pattern(regexp = ".*\\S.*", message = "Role name cannot be empty")
    private String name;

    private SeniorityLevel seniorityLevel;

    private Department department;

    public UpdateRoleRequest() {
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
