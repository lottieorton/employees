package io.nology.employees.employees.dtos;

import java.time.LocalDate;
import java.util.StringJoiner;

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

    @Override
    public String toString() {
        StringJoiner joiner = new StringJoiner(", ", "FindEmployeesQueryDto = {", "}");

        if(search != null) joiner.add("search='" + search + "'");
        if(firstName != null) joiner.add("firstName='" + firstName + "'");
        if(lastName != null) joiner.add("lastName='" + lastName + "'");
        if(emailAddress != null) joiner.add("emailAddress='" + emailAddress + "'");
        if(roleName != null) joiner.add("roleName='" + roleName + "'");
        if(roleId != null) joiner.add("roleId=" + roleId);
        if(workSetup != null) joiner.add("workSetup=" + workSetup);
        if(employmentType != null) joiner.add("employmentType=" + employmentType);
        if(startDateFrom != null) joiner.add("startDateFrom=" + startDateFrom);
        if(startDateTo != null) joiner.add("startDateTo=" + startDateTo);
        if(isCurrentlyEmployed != null) joiner.add("isCurrentlyEmployed=" + isCurrentlyEmployed);

        return joiner.toString();
    }

    public boolean hasFilters() {
        return search != null || firstName != null || lastName != null || 
            emailAddress != null || roleName != null || roleId != null || 
            workSetup != null || employmentType != null || 
            startDateFrom != null || startDateTo != null || 
            isCurrentlyEmployed != null;
    }
}
