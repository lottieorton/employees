package io.nology.employees.role;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import io.nology.employees.role.dtos.CreateRoleRequest;
import io.nology.employees.role.dtos.UpdateRoleRequest;
import io.nology.employees.role.entities.Role;

@Service
public class RoleService {

    private final RoleRepository repo;

    public RoleService(RoleRepository repo) {
        this.repo = repo;
    }

    public List<Role> findAll() {
        return this.repo.findAll();
    }

    public Optional<Role> findById(Long id) {
        return this.repo.findById(id);
    }

    public Role create(CreateRoleRequest data) {
        Role createdRole = new Role();
        createdRole.setName(data.getName().trim());
        createdRole.setSeniorityLevel(data.getSeniorityLevel());
        this.repo.saveAndFlush(createdRole);
        return createdRole;
    }

    public Optional<Role> updateById(Long id, UpdateRoleRequest data) {
        Optional<Role> result = findById(id);
        if(result.isEmpty()) {
            return result;
        }
        Role foundRole = result.get();
        if(data.getName() != null) {
            foundRole.setName(data.getName().trim());
        }
        if(data.getSeniorityLevel() != null) {
            foundRole.setSeniorityLevel(data.getSeniorityLevel());
        }
        this.repo.saveAndFlush(foundRole);
        return Optional.of(foundRole);
    }

    public boolean deleteById(Long id) {
        Optional<Role> result = findById(id);
        if(result.isEmpty()) {
            return false;
        }
        this.repo.delete(result.get());
        return true;
    }
    
}
