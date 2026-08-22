package io.nology.employees.employees.dtos;

import java.time.LocalDate;

import io.nology.employees.employees.entities.EmploymentType;
import io.nology.employees.employees.entities.Pronouns;
import io.nology.employees.employees.entities.WorkSetup;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateEmployeeRequest {
    @NotBlank(message = "First name cannot be empty")
    private String firstName;

    @NotBlank(message = "Last name cannot be empty")
    private String lastName;

    @Pattern(regexp = ".*\\S.*", message = "Middle name cannot be empty")
    private String middleName;

    @Pattern(regexp = ".*\\S.*", message = "Preferred name cannot be empty")
    private String preferredName;

    @NotNull(message = "Pronouns are required")
    private Pronouns pronouns;

    @NotBlank(message = "Phone number cannot be empty")
    @Size(min = 7, max = 20, message = "Phone number must be between 7 and 20 characters")
    @Pattern(
        regexp = "^\\+?[0-9\\s\\-\\(\\)]+$", 
        message = "Phone number can only contain digits, spaces, dashes, parentheses, and an optional leading '+'"
    )
    private String phoneNumber;

    @NotNull
    @Min(1)
    private Long addressId;

    @NotNull
    @Min(1)
    private Long roleId;

    @Min(1)
    private Long managerId;

    @NotNull(message = "Work setup is required")
    private WorkSetup workSetup;

    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate lastDate;

    private Boolean isCurrentlyEmployed;

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

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getPreferredName() {
        return preferredName;
    }

    public void setPreferredName(String preferredName) {
        this.preferredName = preferredName;
    }

    public Pronouns getPronouns() {
        return pronouns;
    }

    public void setPronouns(Pronouns pronouns) {
        this.pronouns = pronouns;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public Long getManagerId() {
        return managerId;
    }

    public void setManagerId(Long managerId) {
        this.managerId = managerId;
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getLastDate() {
        return lastDate;
    }

    public void setLastDate(LocalDate lastDate) {
        this.lastDate = lastDate;
    }

    public Boolean getIsCurrentlyEmployed() {
        return isCurrentlyEmployed;
    }

    public void setIsCurrentlyEmployed(Boolean isCurrentlyEmployed) {
        this.isCurrentlyEmployed = isCurrentlyEmployed;
    }
}
