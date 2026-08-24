package io.nology.employees.role;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import io.nology.employees.role.dtos.CreateRoleRequest;
import io.nology.employees.role.dtos.UpdateRoleRequest;
import io.nology.employees.role.entities.Department;
import io.nology.employees.role.entities.Role;
import io.nology.employees.role.entities.SeniorityLevel;

@ExtendWith(MockitoExtension.class)
public class RoleServiceTest {
    @Mock
    private RoleRepository repo;

    @Mock
    private ModelMapper mapper;

    @InjectMocks
    private RoleService roleService;

    @Test
    public void findAll_CallsFindAll() {
        this.roleService.findAll();
        verify(this.repo).findAll();
    }

    @Test
    public void findById_CallsFindById() {
        this.roleService.findById(1L);
        verify(this.repo).findById(1L);
    }

    @Test
    public void create_SavesRoleInDB() {
        // arrange
        CreateRoleRequest data = new CreateRoleRequest();
        data.setName("Software Developer");
        data.setSeniorityLevel(SeniorityLevel.JUNIOR);
        data.setDepartment(Department.ENGINEERING);

        Role testRole = new Role();
        testRole.setName("Software Developer");
        testRole.setSeniorityLevel(SeniorityLevel.JUNIOR);  
        testRole.setDepartment(Department.ENGINEERING);   

        when(this.mapper.map(data, Role.class)).thenReturn(testRole);
        when(this.repo.saveAndFlush(any(Role.class))).thenAnswer(r -> {
            Role role = r.getArgument(0);
            role.setId(1L);
            return role;
        });

        // act
        Role result = this.roleService.create(data);
        // assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Software Developer", result.getName());

        verify(this.repo).saveAndFlush(testRole);
    }

    @Test
    public void updateById_WhenRoleExists_SavesUpdatedRoleInDB() {
        // arrange
        UpdateRoleRequest data = new UpdateRoleRequest();
        data.setName("Senior Software Developer");
        data.setSeniorityLevel(SeniorityLevel.SENIOR);
        data.setDepartment(Department.PRODUCT);

        Role testRole = new Role();
        testRole.setName("Software Developer");
        testRole.setSeniorityLevel(SeniorityLevel.JUNIOR);  
        testRole.setDepartment(Department.ENGINEERING);
        testRole.setId(1L);

        when(this.repo.findById(1L)).thenReturn(Optional.of(testRole));
        doAnswer(invocation -> {
            UpdateRoleRequest dto = invocation.getArgument(0);
            Role targetRole = invocation.getArgument(1);

            if (dto.getName() != null) {
                targetRole.setName(dto.getName());
            }
            if (dto.getSeniorityLevel() != null) {
                targetRole.setSeniorityLevel(dto.getSeniorityLevel());
            }
            if (dto.getDepartment() != null) {
                targetRole.setDepartment(dto.getDepartment());
            }

            return null;
        }).when(mapper).map(any(UpdateRoleRequest.class), any(Role.class));
        when(this.repo.saveAndFlush(any(Role.class))).thenAnswer(r -> {
            return r.getArgument(0);
        });

        // act
        Optional<Role> result = this.roleService.updateById(1L, data);

        // assert
        assertTrue(result.isPresent());
        assertEquals("Senior Software Developer", result.get().getName());
        assertEquals(SeniorityLevel.SENIOR, result.get().getSeniorityLevel());

        verify(this.repo).findById(1L);
        verify(this.mapper).map(data, testRole);
        verify(this.repo).saveAndFlush(testRole);
    }

    @Test
    public void updateById_WhenRoleDoesNotExist_ReturnsEmpty() {
        // arrange
        UpdateRoleRequest data = new UpdateRoleRequest();
        data.setName("Senior Software Developer");

        when(this.repo.findById(1L)).thenReturn(Optional.empty());

        // act
        Optional<Role> result = this.roleService.updateById(1L, data);

        // assert
        assertTrue(result.isEmpty());

        verify(this.repo).findById(1L);
        verify(this.mapper, never()).map(any(UpdateRoleRequest.class), any(Role.class));
        verify(this.repo, never()).saveAndFlush(any(Role.class));
    }

    @Test
    public void deleteById_WhenRoleExists_DeletesRoleInDB() {
        // arrange
        Role testRole = new Role();
        testRole.setName("Software Developer");
        testRole.setSeniorityLevel(SeniorityLevel.JUNIOR);  
        testRole.setDepartment(Department.ENGINEERING);
        testRole.setId(1L);

        when(this.repo.findById(1L)).thenReturn(Optional.of(testRole));

        // act
        boolean result = this.roleService.deleteById(1L);

        // assert
        assertTrue(result);

        verify(this.repo).findById(1L);
        verify(this.repo).delete(testRole);
    }

    @Test
    public void deleteById_WhenRoleDoesNotExist_ReturnsFalse() {
        // arrange
        when(this.repo.findById(1L)).thenReturn(Optional.empty());

        // act
        boolean result = this.roleService.deleteById(1L);

        // assert
        assertFalse(result);

        verify(this.repo).findById(1L);
        verify(this.repo, never()).delete(any(Role.class));
    }
}
