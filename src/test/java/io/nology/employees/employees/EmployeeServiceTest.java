package io.nology.employees.employees;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import io.nology.employees.address.AddressService;
import io.nology.employees.address.entities.Address;
import io.nology.employees.common.exceptions.UnprocessableContentException;
import io.nology.employees.employees.dtos.CreateEmployeeRequest;
import io.nology.employees.employees.dtos.FindEmployeesQueryDto;
import io.nology.employees.employees.dtos.UpdateEmployeeRequest;
import io.nology.employees.employees.entities.Employee;
import io.nology.employees.employees.entities.EmploymentType;
import io.nology.employees.employees.entities.Pronouns;
import io.nology.employees.employees.entities.WorkSetup;
import io.nology.employees.role.RoleService;
import io.nology.employees.role.entities.Department;
import io.nology.employees.role.entities.Role;
import io.nology.employees.role.entities.SeniorityLevel;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {
    
    @Mock
    private EmployeeRepository repo;

    @Mock
    private ModelMapper mapper;

    @Mock
    private AddressService addressService;

    @Mock
    private RoleService roleService;

    @InjectMocks
    private EmployeeService employeeService;


    // Helper functions

    private Role createRole(Long id, String name, SeniorityLevel seniorityLevel, Department department) {
        Role role = new Role();
        role.setId(id);
        role.setName(name);
        role.setSeniorityLevel(seniorityLevel);  
        role.setDepartment(department);   
        return role;
    }

    private Address createAddress(Long id, String unitNumber, String streetAddress, String addressLine2, String city, String stateProvinceRegion, String postalCode, String country) {
        Address testAddress = new Address();
        testAddress.setId(id);
        testAddress.setUnitNumber(unitNumber);
        testAddress.setStreetAddress(streetAddress);
        testAddress.setAddressLine2(addressLine2);
        testAddress.setCity(city);
        testAddress.setStateProvinceRegion(stateProvinceRegion);
        testAddress.setPostalCode(postalCode);
        testAddress.setCountry(country);
        return testAddress;
    }

    private Employee createEmployee(Long id, String firstName, String lastName, String middleName, String preferredName, Pronouns pronouns, String emailAddress, String phoneNumber, Address address, Role role, Employee manager, WorkSetup workSetup, EmploymentType employmentType, LocalDate startDate, LocalDate lastDate, Boolean isCurrentlyEmployed) {
        Employee employee = new Employee();
        employee.setId(id);
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setMiddleName(middleName);
        employee.setPreferredName(preferredName);
        employee.setPronouns(pronouns);
        employee.setEmailAddress(emailAddress);
        employee.setPhoneNumber(phoneNumber);
        employee.setAddress(address);
        employee.setRole(role);
        employee.setManager(manager);
        employee.setWorkSetup(workSetup);
        employee.setEmploymentType(employmentType);
        employee.setStartDate(startDate);
        employee.setLastDate(lastDate);
        employee.setIsCurrentlyEmployed(isCurrentlyEmployed);
        return employee;
    }

    @Test
    public void findAll_WhenNoQuery_CallsFindAll() {
        this.employeeService.findAll(null);
        verify(this.repo).findAll();
    }

    @Test
    public void findAll_WhenHasQuery_CallsFindAll() {
        FindEmployeesQueryDto queryDto = new FindEmployeesQueryDto();
        queryDto.setFirstName("sarah");

        Employee employee1 = createEmployee(
            null, 
            "Sarah", 
            "Jenkins", 
            "Marie", 
            "SJ", 
            Pronouns.SHE_HER, 
            null, 
            "+61412345678", 
            null, 
            null, 
            null, 
            WorkSetup.ON_SITE, 
            EmploymentType.FULL_TIME_PERMANENT, 
            LocalDate.of(2021, 3, 15), 
            LocalDate.of(2022, 3, 15), 
            true
        );

        when(repo.findAll(any(org.springframework.data.jpa.domain.Specification.class))).thenReturn(List.of(employee1));
        
        // act
        List<Employee> result = this.employeeService.findAll(queryDto);

        // assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(this.repo).findAll(any(org.springframework.data.jpa.domain.Specification.class));
    }

    @Test
    public void findById_CallsFindById() {
        this.employeeService.findById(1L);
        verify(this.repo).findById(1L);
    }
    
    @Test
    public void create_WhenRoleAddressExistsAndValidDates_SavesEmployeeInDB() {
        // arrange
        Role testRole = createRole(1L, "Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Address testAddress = createAddress(1L, "1A", "Palm Tree Lane", "Sunrise Bay", "Sydney", "NSW", "2000", "Aus");
        Employee employee1 = createEmployee(
            null, 
            "Sarah", 
            "Jenkins", 
            "Marie", 
            "SJ", 
            Pronouns.SHE_HER, 
            null, 
            "+61412345678", 
            testAddress, 
            testRole, 
            null, 
            WorkSetup.ON_SITE, 
            EmploymentType.FULL_TIME_PERMANENT, 
            LocalDate.of(2021, 3, 15), 
            LocalDate.of(2022, 3, 15), 
            true
        );
        
        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Sarah");
        data.setLastName("Jenkins");
        data.setAddressId(1L);
        data.setRoleId(1L);
        data.setStartDate(LocalDate.of(2021, 3, 15));
        data.setLastDate(LocalDate.of(2022, 3, 15));
        
        when(this.addressService.findById(1L)).thenReturn(Optional.of(testAddress));
        when(this.roleService.findById(1L)).thenReturn(Optional.of(testRole));
        when(this.mapper.map(data, Employee.class)).thenReturn(employee1);
        when(this.repo.saveAndFlush(any(Employee.class))).thenAnswer(e -> {
            Employee savedEmployee = e.getArgument(0);
            savedEmployee.setId(1L);
            return savedEmployee;
        });
        // act
        Employee result = this.employeeService.create(data);
        // assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("sarah.jenkins@mycompany.com", result.getEmailAddress());

        verify(this.repo).saveAndFlush(employee1);
    }

    @Test
    public void create_WhenRoleAddressManagerExistsAndValidDates_SavesEmployeeInDB() {
        // arrange
        Role testRole = createRole(1L, "Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Address testAddress = createAddress(1L, "1A", "Palm Tree Lane", "Sunrise Bay", "Sydney", "NSW", "2000", "Aus");
        Employee manager = createEmployee(
            1L,
            "Alex",
            "Rivera",
            null,
            "Al",
            Pronouns.HE_HIM,
            "alex.rivera@mycompany.com",
            "+61498765432",
            testAddress,
            testRole,
            null,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2023, 8, 1),
            null,
            true
        );
        Employee employee1 = createEmployee(
            null, 
            "Sarah", 
            "Jenkins", 
            "Marie", 
            "SJ", 
            Pronouns.SHE_HER, 
            null, 
            "+61412345678", 
            testAddress, 
            testRole, 
            null, 
            WorkSetup.ON_SITE, 
            EmploymentType.FULL_TIME_PERMANENT, 
            LocalDate.of(2021, 3, 15), 
            LocalDate.of(2022, 3, 15), 
            true
        );
        
        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Sarah");
        data.setLastName("Jenkins");
        data.setAddressId(1L);
        data.setRoleId(1L);
        data.setManagerId(1L);
        data.setStartDate(LocalDate.of(2021, 3, 15));
        data.setLastDate(LocalDate.of(2022, 3, 15));
        
        when(this.addressService.findById(1L)).thenReturn(Optional.of(testAddress));
        when(this.roleService.findById(1L)).thenReturn(Optional.of(testRole));
        when(this.mapper.map(data, Employee.class)).thenReturn(employee1);
        when(this.repo.findById(1L)).thenReturn(Optional.of(manager));
        when(this.repo.saveAndFlush(any(Employee.class))).thenAnswer(e -> {
            Employee savedEmployee = e.getArgument(0);
            savedEmployee.setId(2L);
            return savedEmployee;
        });
        // act
        Employee result = this.employeeService.create(data);
        // assert
        assertNotNull(result);
        assertEquals(2L, result.getId());
        assertEquals("sarah.jenkins@mycompany.com", result.getEmailAddress());

        verify(this.repo).saveAndFlush(employee1);
    }

    @Test
    public void create_WhenRoleDoesNotExist_ThrowsException() {
        // arrange       
        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Sarah");
        data.setLastName("Jenkins");
        data.setAddressId(1L);
        data.setRoleId(1L);
        data.setStartDate(LocalDate.of(2021, 3, 15));
        data.setLastDate(LocalDate.of(2022, 3, 15));
        
        when(this.roleService.findById(1L)).thenReturn(Optional.empty());
        
        // assert
        assertThrows(UnprocessableContentException.class, () -> this.employeeService.create(data));
        verify(this.addressService, never()).findById(1L);
        verify(this.mapper, never()).map(data, Employee.class);
        verify(this.repo, never()).saveAndFlush(any(Employee.class));
    }

    @Test
    public void create_WhenAddressDoesNotExist_ThrowsException() {
        // arrange       
        Role testRole = createRole(1L, "Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);

        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Sarah");
        data.setLastName("Jenkins");
        data.setAddressId(1L);
        data.setRoleId(1L);
        data.setStartDate(LocalDate.of(2021, 3, 15));
        data.setLastDate(LocalDate.of(2022, 3, 15));
        
        when(this.roleService.findById(1L)).thenReturn(Optional.of(testRole));
        when(this.addressService.findById(1L)).thenReturn(Optional.empty());

        // assert
        assertThrows(UnprocessableContentException.class, () -> this.employeeService.create(data));
        verify(this.roleService).findById(1L);
        verify(this.mapper, never()).map(data, Employee.class);
        verify(this.repo, never()).saveAndFlush(any(Employee.class));
    }

    @Test
    public void create_WhenManagerDoesNotExist_ThrowsException() {
        // arrange       
        Role testRole = createRole(1L, "Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Address testAddress = createAddress(1L, "1A", "Palm Tree Lane", "Sunrise Bay", "Sydney", "NSW", "2000", "Aus");
        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Sarah");
        data.setLastName("Jenkins");
        data.setAddressId(1L);
        data.setRoleId(1L);
        data.setManagerId(1L);
        data.setStartDate(LocalDate.of(2021, 3, 15));
        data.setLastDate(LocalDate.of(2022, 3, 15));
        
        when(this.roleService.findById(1L)).thenReturn(Optional.of(testRole));
        when(this.addressService.findById(1L)).thenReturn(Optional.of(testAddress));
        when(this.repo.findById(1L)).thenReturn(Optional.empty());

        // assert
        assertThrows(UnprocessableContentException.class, () -> this.employeeService.create(data));
        verify(this.roleService).findById(1L);
        verify(this.addressService).findById(1L);
        verify(this.mapper).map(data, Employee.class);
        verify(this.repo, never()).saveAndFlush(any(Employee.class));
    }

    @Test
    public void create_WhenDatesInvalid_ThrowsException() {
        // arrange       
        Role testRole = createRole(1L, "Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Address testAddress = createAddress(1L, "1A", "Palm Tree Lane", "Sunrise Bay", "Sydney", "NSW", "2000", "Aus");
        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Sarah");
        data.setLastName("Jenkins");
        data.setAddressId(1L);
        data.setRoleId(1L);
        data.setStartDate(LocalDate.of(2021, 3, 15));
        data.setLastDate(LocalDate.of(2020, 3, 15));
        
        when(this.roleService.findById(1L)).thenReturn(Optional.of(testRole));
        when(this.addressService.findById(1L)).thenReturn(Optional.of(testAddress));

        // assert
        assertThrows(UnprocessableContentException.class, () -> this.employeeService.create(data));
        verify(this.roleService).findById(1L);
        verify(this.addressService).findById(1L);
        verify(this.mapper, never()).map(data, Employee.class);
        verify(this.repo, never()).saveAndFlush(any(Employee.class));
    }

    @Test
    public void create_WhenEmailExists_IncreasesNumberInEmail() {
        // arrange       
        Role testRole = createRole(1L, "Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Address testAddress = createAddress(1L, "1A", "Palm Tree Lane", "Sunrise Bay", "Sydney", "NSW", "2000", "Aus");
        Employee employee1 = createEmployee(
            null, 
            "Sarah", 
            "Jenkins", 
            "Marie", 
            "SJ", 
            Pronouns.SHE_HER, 
            null, 
            "+61412345678", 
            testAddress, 
            testRole, 
            null, 
            WorkSetup.ON_SITE, 
            EmploymentType.FULL_TIME_PERMANENT, 
            LocalDate.of(2021, 3, 15), 
            LocalDate.of(2022, 3, 15), 
            true
        );

        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Sarah");
        data.setLastName("Jenkins");
        data.setAddressId(1L);
        data.setRoleId(1L);
        data.setStartDate(LocalDate.of(2021, 3, 15));
        data.setLastDate(LocalDate.of(2022, 3, 15));

        when(this.addressService.findById(1L)).thenReturn(Optional.of(testAddress));
        when(this.roleService.findById(1L)).thenReturn(Optional.of(testRole));
        when(this.mapper.map(data, Employee.class)).thenReturn(employee1);
        when(this.repo.existsByEmailAddress("sarah.jenkins@mycompany.com")).thenReturn(true);
        when(this.repo.saveAndFlush(any(Employee.class))).thenAnswer(e -> {
            Employee savedEmployee = e.getArgument(0);
            savedEmployee.setId(1L);
            return savedEmployee;
        });
        // act
        Employee result = this.employeeService.create(data);
        // assert
        assertNotNull(result);
        assertEquals("sarah.jenkins1@mycompany.com", result.getEmailAddress());

        verify(this.repo).saveAndFlush(employee1);
    }

    @Test
    public void updateById_WhenEmployeeExistsAndValidDependencies_SavesUpdatedEmployeeInDB() {
        // arrange
        Role testRole = createRole(1L, "Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Address testAddress = createAddress(1L, "1A", "Palm Tree Lane", "Sunrise Bay", "Sydney", "NSW", "2000", "Aus");
        Employee manager = createEmployee(
            1L,
            "Alex",
            "Rivera",
            null,
            "Al",
            Pronouns.HE_HIM,
            "alex.rivera@mycompany.com",
            "+61498765432",
            testAddress,
            testRole,
            null,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2023, 8, 1),
            null,
            true
        );
        Employee employee1 = createEmployee(
            2L, 
            "Sarah", 
            "Jenkins", 
            "Marie", 
            "SJ", 
            Pronouns.SHE_HER, 
            "sarah.jenkins@mycompany.com", 
            "+61412345678", 
            testAddress, 
            testRole, 
            null, 
            WorkSetup.ON_SITE, 
            EmploymentType.FULL_TIME_PERMANENT, 
            LocalDate.of(2021, 3, 15), 
            LocalDate.of(2022, 3, 15), 
            true
        );

        
        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setFirstName("Susan");
        data.setLastName("Summer");
        data.setAddressId(1L);
        data.setRoleId(1L);
        data.setManagerId(1L);
        data.setStartDate(LocalDate.of(2021, 3, 15));
        data.setLastDate(LocalDate.of(2022, 3, 15));
        
        when(this.repo.findById(2L)).thenReturn(Optional.of(employee1));
        doAnswer(invocation -> {
            UpdateEmployeeRequest dto = invocation.getArgument(0);
            Employee targetEmployee = invocation.getArgument(1);
            targetEmployee.setFirstName(dto.getFirstName());
            targetEmployee.setLastName(dto.getLastName());
            targetEmployee.setStartDate(dto.getStartDate());
            targetEmployee.setLastDate(dto.getLastDate());
            return null;
        }).when(mapper).map(any(UpdateEmployeeRequest.class), any(Employee.class));
        when(this.roleService.findById(1L)).thenReturn(Optional.of(testRole));
        when(this.addressService.findById(1L)).thenReturn(Optional.of(testAddress));
        when(this.repo.findById(1L)).thenReturn(Optional.of(manager));
        when(this.repo.saveAndFlush(any(Employee.class))).thenAnswer(e -> {
            return e.getArgument(0);
        });
        // act
        Optional<Employee> result = this.employeeService.updateById(2L, data);
        // assert
        assertTrue(result.isPresent());
        assertEquals("Susan", result.get().getFirstName());
        assertEquals("Summer", result.get().getLastName());

        verify(this.repo).findById(2L);
        verify(this.mapper).map(data, employee1);
        verify(this.roleService).findById(1L);
        verify(this.addressService).findById(1L);
        verify(this.repo).findById(1L);
        verify(this.repo).saveAndFlush(employee1);
    }

    @Test
    public void updateById_WhenEmployeeDoesNotExist_ReturnsEmpty() {
        // arrange        
        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setFirstName("Susan");
        data.setLastName("Summer");
        data.setAddressId(1L);
        data.setRoleId(1L);
        data.setManagerId(1L);
        data.setStartDate(LocalDate.of(2021, 3, 15));
        data.setLastDate(LocalDate.of(2022, 3, 15));
        
        when(this.repo.findById(2L)).thenReturn(Optional.empty());
        // act
        Optional<Employee> result = this.employeeService.updateById(2L, data);
        // assert
        assertTrue(result.isEmpty());

        verify(this.repo).findById(2L);
        verify(this.mapper, never()).map(any(UpdateEmployeeRequest.class), any(Employee.class));
        verify(this.roleService, never()).findById(1L);
        verify(this.addressService, never()).findById(1L);
        verify(this.repo, never()).findById(1L);
        verify(this.repo, never()).saveAndFlush(any(Employee.class));
    }

    @Test
    public void updateById_WhenDatesInvalid_ThrowsException() {
        // arrange
        Employee employee1 = createEmployee(
            null, 
            "Sarah", 
            "Jenkins", 
            "Marie", 
            "SJ", 
            Pronouns.SHE_HER, 
            "sarah.jenkins@mycompany.com", 
            "+61412345678", 
            null, 
            null, 
            null, 
            WorkSetup.ON_SITE, 
            EmploymentType.FULL_TIME_PERMANENT, 
            LocalDate.of(2021, 3, 15), 
            LocalDate.of(2022, 3, 15), 
            true
        );
        
        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setFirstName("Susan");
        data.setLastName("Summer");
        data.setStartDate(LocalDate.of(2021, 3, 15));
        data.setLastDate(LocalDate.of(2020, 3, 15));
        
        when(this.repo.findById(2L)).thenReturn(Optional.of(employee1));
        // act
        assertThrows(UnprocessableContentException.class, () -> this.employeeService.updateById(2L, data));
        // assert
        verify(this.repo).findById(2L);
        verify(this.mapper, never()).map(any(UpdateEmployeeRequest.class), any(Employee.class));
        verify(this.repo, never()).saveAndFlush(any(Employee.class));
    }

    @Test
    public void updateById_WhenRoleDoesNotExist_ThrowsException() {
        // arrange
        Employee employee1 = createEmployee(
            2L, 
            "Sarah", 
            "Jenkins", 
            "Marie", 
            "SJ", 
            Pronouns.SHE_HER, 
            "sarah.jenkins@mycompany.com", 
            "+61412345678", 
            null, 
            null, 
            null, 
            WorkSetup.ON_SITE, 
            EmploymentType.FULL_TIME_PERMANENT, 
            LocalDate.of(2021, 3, 15), 
            LocalDate.of(2022, 3, 15), 
            true
        );
        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setFirstName("Susan");
        data.setLastName("Summer");
        data.setRoleId(1L);
        
        when(this.repo.findById(2L)).thenReturn(Optional.of(employee1));
        doAnswer(invocation -> {
            UpdateEmployeeRequest dto = invocation.getArgument(0);
            Employee targetEmployee = invocation.getArgument(1);
            targetEmployee.setFirstName(dto.getFirstName());
            targetEmployee.setLastName(dto.getLastName());
            return null;
        }).when(mapper).map(any(UpdateEmployeeRequest.class), any(Employee.class));
        when(this.roleService.findById(1L)).thenReturn(Optional.empty());
        // act
        assertThrows(UnprocessableContentException.class, () -> this.employeeService.updateById(2L, data));
        // assert
        verify(this.repo).findById(2L);
        verify(this.mapper).map(data, employee1);
        verify(this.roleService).findById(1L);
        verify(this.repo, never()).findById(1L);
        verify(this.repo, never()).saveAndFlush(any(Employee.class));
    }

    @Test
    public void updateById_WhenAddressDoesNotExist_ThrowsException() {
       // arrange
       Employee employee1 = createEmployee(
            2L, 
            "Sarah", 
            "Jenkins", 
            "Marie", 
            "SJ", 
            Pronouns.SHE_HER, 
            "sarah.jenkins@mycompany.com", 
            "+61412345678", 
            null, 
            null, 
            null, 
            WorkSetup.ON_SITE, 
            EmploymentType.FULL_TIME_PERMANENT, 
            LocalDate.of(2021, 3, 15), 
            LocalDate.of(2022, 3, 15), 
            true
        );
        
        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setFirstName("Susan");
        data.setLastName("Summer");
        data.setAddressId(1L);
        
        when(this.repo.findById(2L)).thenReturn(Optional.of(employee1));
        doAnswer(invocation -> {
            UpdateEmployeeRequest dto = invocation.getArgument(0);
            Employee targetEmployee = invocation.getArgument(1);
            targetEmployee.setFirstName(dto.getFirstName());
            targetEmployee.setLastName(dto.getLastName());
            return null;
        }).when(mapper).map(any(UpdateEmployeeRequest.class), any(Employee.class));
        when(this.addressService.findById(1L)).thenReturn(Optional.empty());
        // act
        assertThrows(UnprocessableContentException.class, () -> this.employeeService.updateById(2L, data));
        // assert
        verify(this.repo).findById(2L);
        verify(this.mapper).map(data, employee1);
        verify(this.addressService).findById(1L);
        verify(this.repo, never()).saveAndFlush(any(Employee.class)); 
    }

    @Test
    public void updateById_WhenManagerDoesNotExist_ThrowsException() {
        // arrange
        Employee employee1 = createEmployee(
            2L, 
            "Sarah", 
            "Jenkins", 
            "Marie", 
            "SJ", 
            Pronouns.SHE_HER, 
            "sarah.jenkins@mycompany.com", 
            "+61412345678", 
            null, 
            null, 
            null, 
            WorkSetup.ON_SITE, 
            EmploymentType.FULL_TIME_PERMANENT, 
            LocalDate.of(2021, 3, 15), 
            LocalDate.of(2022, 3, 15), 
            true
        );
        
        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setFirstName("Susan");
        data.setLastName("Summer");
        data.setManagerId(1L);
        
        when(this.repo.findById(2L)).thenReturn(Optional.of(employee1));
        doAnswer(invocation -> {
            UpdateEmployeeRequest dto = invocation.getArgument(0);
            Employee targetEmployee = invocation.getArgument(1);
            targetEmployee.setFirstName(dto.getFirstName());
            targetEmployee.setLastName(dto.getLastName());
            return null;
        }).when(mapper).map(any(UpdateEmployeeRequest.class), any(Employee.class));
        when(this.repo.findById(1L)).thenReturn(Optional.empty());
        // act
        assertThrows(UnprocessableContentException.class, () -> this.employeeService.updateById(2L, data));
        // assert
        verify(this.repo).findById(2L);
        verify(this.mapper).map(data, employee1);
        verify(this.repo).findById(1L);
        verify(this.repo, never()).saveAndFlush(any(Employee.class)); 
    }

    @Test
    public void deleteById_WhenEmployeeExists_DeletedEmployeeInDB() {
        // arrange
        Employee employee1 = createEmployee(
            2L, 
            "Sarah", 
            "Jenkins", 
            "Marie", 
            "SJ", 
            Pronouns.SHE_HER, 
            "sarah.jenkins@mycompany.com", 
            "+61412345678", 
            null, 
            null, 
            null, 
            WorkSetup.ON_SITE, 
            EmploymentType.FULL_TIME_PERMANENT, 
            LocalDate.of(2021, 3, 15), 
            LocalDate.of(2022, 3, 15), 
            true
        );

        when(this.repo.findById(2L)).thenReturn(Optional.of(employee1));
        // act
        boolean result = this.employeeService.deleteById(2L);
        // assert
        assertTrue(result);

        verify(this.repo).findById(2L);
        verify(this.repo).delete(employee1);
    }

    @Test
    public void deleteById_WhenEmployeeDoesNotExist_ReturnsFalse() {
        // arrange 
        when(this.repo.findById(2L)).thenReturn(Optional.empty());
        // act
        boolean result = this.employeeService.deleteById(2L);
        // assert
        assertFalse(result);

        verify(this.repo).findById(2L);
        verify(this.repo, never()).delete(any(Employee.class));
    }
}
