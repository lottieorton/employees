package io.nology.employees.role;

import org.springframework.data.jpa.repository.JpaRepository;

import io.nology.employees.role.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    
}
