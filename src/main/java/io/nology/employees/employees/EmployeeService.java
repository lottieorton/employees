package io.nology.employees.employees;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import io.nology.employees.address.AddressService;
import io.nology.employees.address.entities.Address;
import io.nology.employees.common.exceptions.UnprocessableContentException;
import io.nology.employees.employees.dtos.CreateEmployeeRequest;
import io.nology.employees.employees.dtos.UpdateEmployeeRequest;
import io.nology.employees.employees.entities.Employee;
import io.nology.employees.role.RoleService;
import io.nology.employees.role.entities.Role;

@Service
public class EmployeeService {

    private final EmployeeRepository repo;
    private final ModelMapper mapper;
    private final AddressService addressService;
    private final RoleService roleService;

    public EmployeeService(EmployeeRepository repo, ModelMapper mapper, AddressService addressService, RoleService roleService) {
        this.repo = repo;
        this.mapper = mapper;
        this.addressService = addressService;
        this.roleService = roleService;
    }

    public List<Employee> findAll() {
        return this.repo.findAll();
    }

    public Optional<Employee> findById(Long id) {
        return this.repo.findById(id);
    }

    public Employee create(CreateEmployeeRequest data) {
        Role foundRole = resolveRole(data.getRoleId());
        Address foundAddress = resolveAddress(data.getAddressId());
        validateDates(data.getStartDate(), data.getLastDate());
        
        Employee createdEmployee = this.mapper.map(data, Employee.class);
        
        
        if(data.getManagerId() != null) {
            Employee foundManager = resolveManager(data.getManagerId());
            createdEmployee.setManager(foundManager);
        } 
        
        String uniqueEmail = createUniqueEmail(data.getFirstName(), data.getLastName());
        createdEmployee.setEmailAddress(uniqueEmail);
        
        createdEmployee.setRole(foundRole);     
        createdEmployee.setAddress(foundAddress);
        this.repo.saveAndFlush(createdEmployee);
        return createdEmployee;  
    }
    
    public Optional<Employee> updateById(Long id, UpdateEmployeeRequest data) {
        Optional<Employee> result = this.findById(id);
        if(result.isEmpty()) {
            return result;
        }
        Employee foundEmployee = result.get();
        
        LocalDate newStartDate = data.getStartDate() != null ? data.getStartDate() : foundEmployee.getStartDate();
        LocalDate newLastDate = data.getLastDate() != null ? data.getLastDate() : foundEmployee.getLastDate();
        
        validateDates(newStartDate, newLastDate);
        
        this.mapper.map(data, foundEmployee);
        if(data.getRoleId() != null) {
            Role foundRole = resolveRole(data.getRoleId());
            foundEmployee.setRole(foundRole);
        }
        if(data.getAddressId() != null) {
            Address foundAddress = resolveAddress(data.getAddressId());
            foundEmployee.setAddress(foundAddress);
        }
        if(data.getManagerId() != null) {
            Employee foundManager = resolveManager(data.getManagerId());
            foundEmployee.setManager(foundManager);
        }
        this.repo.saveAndFlush(foundEmployee);
        return Optional.of(foundEmployee);
    }
    
    public boolean deleteById(Long id) {
        Optional<Employee> result = this.findById(id);
        if(result.isEmpty()) {
            return false;
        }
        this.repo.delete(result.get());
        return true;
    }

    private void validateDates(LocalDate startDate, LocalDate lastDate) {
        if (startDate != null && lastDate != null && startDate.isAfter(lastDate)) {
            throw new UnprocessableContentException("Start date cannot be after employee's last date.");
        }
    }
    
    private String createUniqueEmail(String firstName, String lastName) {
        String cleanFirst = firstName.toLowerCase().replaceAll("[^a-z0-9]", "");
        String cleanLast = lastName.toLowerCase().replaceAll("[^a-z0-9]", "");
        
        String emailBase = cleanFirst + "." + cleanLast;
        String domain = "@mycompany.com";

        String candidateEmail = emailBase + domain;
        int counter = 1;

        while(this.repo.existsByEmailAddress(candidateEmail)) {
            candidateEmail = emailBase + counter + domain;
            counter++;
        }

        return candidateEmail;
    }

    private Role resolveRole(Long id) {
        Optional<Role> returnedRole = this.roleService.findById(id);
        if(returnedRole.isEmpty()) {
            throw new UnprocessableContentException("No role with id " + id);
        }
        return returnedRole.get();
    }
    
    private Address resolveAddress(Long id) {
        Optional<Address> returnedAddress = this.addressService.findById(id);
        if(returnedAddress.isEmpty()) {
            throw new UnprocessableContentException("No address with id " + id);
        }
        return returnedAddress.get();
    }

    private Employee resolveManager(Long id) {
        Optional<Employee> returnedEmployee = this.findById(id);
        if(returnedEmployee.isEmpty()) {
            throw new UnprocessableContentException("No manager with id " + id);
        }
        return returnedEmployee.get();
    }

}
