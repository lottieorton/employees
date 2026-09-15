package io.nology.employees.employees;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import io.nology.employees.employees.entities.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {
    
    @EntityGraph(attributePaths = {"role", "address", "manager", "manager.role"})
    Page<Employee> findAll(Specification<Employee> spec, Pageable pageable);
    
    boolean existsByEmailAddress(String emailAddress);

    boolean existsByEmailAddressAndIdNot(String emailAddress, Long id);

    boolean existsByManagerId(Long id);
}
