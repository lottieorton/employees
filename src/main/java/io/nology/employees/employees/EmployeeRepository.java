package io.nology.employees.employees;

import org.springframework.data.jpa.repository.JpaRepository;

import io.nology.employees.employees.entities.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmailAddress(String emailAddress);
}
