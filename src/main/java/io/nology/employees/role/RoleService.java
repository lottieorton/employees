package io.nology.employees.role;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import io.nology.employees.role.dtos.CreateRoleRequest;
import io.nology.employees.role.dtos.UpdateRoleRequest;
import io.nology.employees.role.entities.Role;

@Service
public class RoleService {

    private final RoleRepository repo;
    private final ModelMapper mapper;

    public RoleService(RoleRepository repo, ModelMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public List<Role> findAll() {
        return this.repo.findAll();
    }

    public Optional<Role> findById(Long id) {
        return this.repo.findById(id);
    }

    public Role create(CreateRoleRequest data) {
        Role createdRole = this.mapper.map(data, Role.class);
        this.repo.saveAndFlush(createdRole);
        return createdRole;
    }

    public Optional<Role> updateById(Long id, UpdateRoleRequest data) {
        Optional<Role> result = findById(id);
        if(result.isEmpty()) {
            return result;
        }
        Role foundRole = result.get();
        this.mapper.map(data, foundRole);
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
