package io.nology.employees.employees;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import io.nology.employees.employees.dtos.FindEmployeesQueryDto;
import io.nology.employees.employees.entities.Employee;
import io.nology.employees.employees.entities.EmploymentType;
import io.nology.employees.employees.entities.WorkSetup;
import jakarta.persistence.criteria.Predicate;

public class EmployeeSpecification {
    public static Specification<Employee> withDynamicQuery(FindEmployeesQueryDto query) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // generic search
            if(query.getSearch() != null && !query.getSearch().isBlank()) {
                String term = "%" + query.getSearch().toLowerCase().trim() + "%";
                
                List<Predicate> searchPredicates = new ArrayList<>();
                searchPredicates.add(cb.like(cb.lower(root.get("firstName")), term));
                searchPredicates.add(cb.like(cb.lower(root.get("lastName")), term));
                searchPredicates.add(cb.like(cb.lower(cb.concat(cb.concat(root.get("firstName"), " "), root.get("lastName"))), term));
                searchPredicates.add(cb.like(cb.lower(root.get("emailAddress")), term));
                searchPredicates.add(cb.like(cb.lower(root.get("role").get("name")), term));
             
                List<WorkSetup> matchingWorkSetups = findMatchingWorkSetups(query.getSearch());
                if(!matchingWorkSetups.isEmpty()) {
                    searchPredicates.add(root.get("workSetup").in(matchingWorkSetups));
                }

                List<EmploymentType> matchingEmploymentTypes = findMatchingEmploymentTypes(query.getSearch());
                if(!matchingEmploymentTypes.isEmpty()) {
                    searchPredicates.add(root.get("employmentType").in(matchingEmploymentTypes));
                }

                predicates.add(cb.or(searchPredicates.toArray(new Predicate[0])));
            }

            // specific field searches/filters
            if(query.getFirstName() != null) {
                predicates.add(cb.like(cb.lower(root.get("firstName")), "%" + query.getFirstName().toLowerCase().trim() + "%"));
            }

            if(query.getLastName() != null) {
                predicates.add(cb.like(cb.lower(root.get("lastName")), "%" + query.getLastName().toLowerCase().trim() + "%"));
            }

            if(query.getEmailAddress() != null) {
                predicates.add(cb.like(cb.lower(root.get("emailAddress")), "%" + query.getEmailAddress().toLowerCase().trim() + "%"));
            }
            
            if(query.getWorkSetup() != null) {
                predicates.add(cb.equal(root.get("workSetup"), query.getWorkSetup()));
            }

            if(query.getEmploymentType() != null) {
                predicates.add(cb.equal(root.get("employmentType"), query.getEmploymentType()));
            }

            if(query.getIsCurrentlyEmployed() != null) {
                predicates.add(cb.equal(root.get("isCurrentlyEmployed"), query.getIsCurrentlyEmployed()));
            }

            if(query.getStartDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), query.getStartDateFrom()));
            }

            if(query.getStartDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("startDate"), query.getStartDateTo()));
            }

            if(query.getRoleId() != null) {
                predicates.add(cb.equal(root.get("role").get("id"), query.getRoleId()));
            }

            if(query.getRoleName() != null && !query.getRoleName().isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("role").get("name")), "%" + query.getRoleName().toLowerCase().trim() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static List<WorkSetup> findMatchingWorkSetups(String input) {
        String cleanInput = input.trim().toUpperCase();
        return Arrays.stream(WorkSetup.values()).filter(e -> e.name().contains(cleanInput)).toList();
    }

    private static List<EmploymentType> findMatchingEmploymentTypes(String input) {
        String cleanInput = input.trim().toUpperCase();
        return Arrays.stream(EmploymentType.values()).filter(e -> e.name().contains(cleanInput)).toList();
    }
}
