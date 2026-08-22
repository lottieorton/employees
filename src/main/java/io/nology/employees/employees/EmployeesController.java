package io.nology.employees.employees;

import io.nology.employees.common.exceptions.NotFoundException;
import io.nology.employees.employees.dtos.CreateEmployeeRequest;
import io.nology.employees.employees.dtos.EmployeeResponse;
import io.nology.employees.employees.dtos.UpdateEmployeeRequest;
import io.nology.employees.employees.entities.Employee;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/employees")
@Tag(name = "Employees Controller")
public class EmployeesController {
    private final EmployeeService employeeService;

    public EmployeesController(EmployeeService employeeService, EmployeeRepository employeeRepository) {
        this.employeeService = employeeService;
    }

    @GetMapping()
    public ResponseEntity<List<EmployeeResponse>> findAllEmployees() {
        List<Employee> allEmployees = this.employeeService.findAll();
        return ResponseEntity.ok(EmployeeResponse.of(allEmployees));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponse> findEmployeeById(@PathVariable Long id) {
        Employee result = this.employeeService.findById(id)
        .orElseThrow(() -> new NotFoundException("Could not find employee with id " + id));
        return ResponseEntity.ok(EmployeeResponse.of(result));
    }
    
    @PostMapping()
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody CreateEmployeeRequest data) {
        Employee result = this.employeeService.create(data);
        return new ResponseEntity<EmployeeResponse>(EmployeeResponse.of(result), HttpStatus.CREATED);
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployeeById(@PathVariable Long id, @Valid @RequestBody UpdateEmployeeRequest data) {
        Employee result = this.employeeService.updateById(id, data)
        .orElseThrow(() -> new NotFoundException("Could not find employee with id " + id));
        return ResponseEntity.ok(EmployeeResponse.of(result));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployeeById(@PathVariable Long id) {
        boolean isDeleted = this.employeeService.deleteById(id);
        if(isDeleted) {
            return ResponseEntity.noContent().build();
        }
        throw new NotFoundException("Could not find employee with id " + id);
    }
}
