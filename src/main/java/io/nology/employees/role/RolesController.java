package io.nology.employees.role;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.nology.employees.common.exceptions.NotFoundException;
import io.nology.employees.role.dtos.CreateRoleRequest;
import io.nology.employees.role.dtos.RoleResponse;
import io.nology.employees.role.dtos.UpdateRoleRequest;
import io.nology.employees.role.entities.Role;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/roles")
public class RolesController {
    private final RoleService roleService;

    public RolesController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping()
    public ResponseEntity<List<RoleResponse>> findAllRoles() {
        List<Role> allRoles = this.roleService.findAll();
        return ResponseEntity.ok(RoleResponse.of(allRoles));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> findRoleById(@PathVariable Long id) {
        Role result = this.roleService.findById(id)
        .orElseThrow(() -> new NotFoundException("Could not find role with id " + id));
        return ResponseEntity.ok(RoleResponse.of(result));
    }

    @PostMapping()
    public ResponseEntity<RoleResponse> createRole(@Valid @RequestBody CreateRoleRequest data) {
        Role result = this.roleService.create(data);
        return new ResponseEntity<RoleResponse>(RoleResponse.of(result), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RoleResponse> updateRoleById(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest data) {
        Role result = this.roleService.updateById(id, data)
        .orElseThrow(() -> new NotFoundException("Could not find role with id " + id));
        return ResponseEntity.ok(RoleResponse.of(result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoleById(@PathVariable Long id) {
        boolean isDeleted = this.roleService.deleteById(id);
        if(isDeleted) {
            return ResponseEntity.noContent().build();
        }
        throw new NotFoundException("Could not find role with id " + id);
    }
    
}
