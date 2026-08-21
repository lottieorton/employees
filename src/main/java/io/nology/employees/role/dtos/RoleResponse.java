package io.nology.employees.role.dtos;

import java.util.List;

import io.nology.employees.role.entities.Role;
import io.nology.employees.role.entities.SeniorityLevel;

public record RoleResponse(Long id, String name, SeniorityLevel seniorityLevel) {
    public static RoleResponse of(Role role) {
        return new RoleResponse(role.getId(), role.getName(), role.getSeniorityLevel());
    }

    public static List<RoleResponse> of(List<Role> roles) {
        return roles.stream().map(r -> RoleResponse.of(r)).toList();
    }
}
