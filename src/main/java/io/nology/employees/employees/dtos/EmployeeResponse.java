package io.nology.employees.employees.dtos;

import java.time.LocalDate;
import java.util.List;

import io.nology.employees.employees.entities.Employee;
import io.nology.employees.employees.entities.EmploymentType;
import io.nology.employees.employees.entities.Pronouns;
import io.nology.employees.employees.entities.WorkSetup;
import io.nology.employees.role.entities.Department;
import io.nology.employees.role.entities.SeniorityLevel;

public record EmployeeResponse (Long id, String firstName, String lastName, String middleName, String preferredName, Pronouns pronouns, String emailAddress, String phoneNumber, AddressSummary address, RoleSummary role, ManagerSummary manager, WorkSetup workSetup, EmploymentType employmentType, LocalDate startDate, LocalDate lastDate, boolean isCurrentlyEmployed){
    
    public record AddressSummary(Long id, String unitNumber, String streetAddress, String addressLine2, String city, String stateProvinceRegion, String postalCode, String country) {}
    public record RoleSummary(Long id, String name, SeniorityLevel seniorityLevel, Department department) {}
    public record ManagerSummary(Long id, String fullName, String role) {}

    public static EmployeeResponse of(Employee employee) {
        ManagerSummary managerSummary = null;
        if (employee.getManager() != null) {
            String fullName = (employee.getManager().getFirstName() + " " + employee.getManager().getLastName()).trim();
            managerSummary = new ManagerSummary(employee.getManager().getId(), fullName, employee.getManager().getRole().getName());
        }

        AddressSummary addressSummary = null;
        if (employee.getAddress() != null) {
            addressSummary = new AddressSummary(
                employee.getAddress().getId(),
                employee.getAddress().getUnitNumber(),
                employee.getAddress().getStreetAddress(),
                employee.getAddress().getAddressLine2(),
                employee.getAddress().getCity(),
                employee.getAddress().getStateProvinceRegion(),
                employee.getAddress().getPostalCode(),
                employee.getAddress().getCountry()
            );
        }

        RoleSummary roleSummary = null;
        if (employee.getRole() != null) {
            roleSummary = new RoleSummary(
                employee.getRole().getId(),
                employee.getRole().getName(),
                employee.getRole().getSeniorityLevel(),
                employee.getRole().getDepartment()
            );
        }

        return new EmployeeResponse(
            employee.getId(),
            employee.getFirstName(),
            employee.getLastName(),
            employee.getMiddleName(),
            employee.getPreferredName(),
            employee.getPronouns(),
            employee.getEmailAddress(),
            employee.getPhoneNumber(),
            addressSummary,
            roleSummary,
            managerSummary,
            employee.getWorkSetup(),
            employee.getEmploymentType(),
            employee.getStartDate(),
            employee.getLastDate(),
            employee.getIsCurrentlyEmployed()
        );
    } 

    public static List<EmployeeResponse> of(List<Employee> employees) {
        return employees.stream().map(e -> EmployeeResponse.of(e)).toList();
    }
}
