package io.nology.employees.employees.dtos;

import java.time.LocalDate;

import io.nology.employees.employees.entities.EmploymentType;
import io.nology.employees.employees.entities.WorkSetup;

public class FindEmployeesQueryDto {
    // Generic substring search across multiple fields
    private String search;
    private String firstName;
    private String lastName;
    private String emailAddress;
    private String roleName;
    private Long roleId;
    private WorkSetup workSetup;
    private EmploymentType employmentType;
    private LocalDate startDateFrom;
    private LocalDate startDateTo;
    private Boolean isCurrentlyEmployed;

    public String getSearch() {
        return search;
    }
    public void setSearch(String search) {
        this.search = search;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getEmailAddress() {
        return emailAddress;
    }
    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }
    public String getRoleName() {
        return roleName;
    }
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
    public Long getRoleId() {
        return roleId;
    }
    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }
    public WorkSetup getWorkSetup() {
        return workSetup;
    }
    public void setWorkSetup(WorkSetup workSetup) {
        this.workSetup = workSetup;
    }
    public EmploymentType getEmploymentType() {
        return employmentType;
    }
    public void setEmploymentType(EmploymentType employmentType) {
        this.employmentType = employmentType;
    }
    public LocalDate getStartDateFrom() {
        return startDateFrom;
    }
    public void setStartDateFrom(LocalDate startDateFrom) {
        this.startDateFrom = startDateFrom;
    }
    public LocalDate getStartDateTo() {
        return startDateTo;
    }
    public void setStartDateTo(LocalDate startDateTo) {
        this.startDateTo = startDateTo;
    }
    public Boolean getIsCurrentlyEmployed() {
        return isCurrentlyEmployed;
    }
    public void setIsCurrentlyEmployed(Boolean isCurrentlyEmployed) {
        this.isCurrentlyEmployed = isCurrentlyEmployed;
    }

}
