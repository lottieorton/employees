package io.nology.employees.employees;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.jdbc.Sql;

import io.nology.employees.address.AddressRepository;
import io.nology.employees.address.entities.Address;
import io.nology.employees.employees.dtos.CreateEmployeeRequest;
import io.nology.employees.employees.dtos.UpdateEmployeeRequest;
import io.nology.employees.employees.entities.Employee;
import io.nology.employees.employees.entities.EmploymentType;
import io.nology.employees.employees.entities.Pronouns;
import io.nology.employees.employees.entities.WorkSetup;
import io.nology.employees.role.RoleRepository;
import io.nology.employees.role.entities.Department;
import io.nology.employees.role.entities.Role;
import io.nology.employees.role.entities.SeniorityLevel;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

import static org.hamcrest.Matchers.*;

import java.time.LocalDate;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(scripts = "/sql/cleanup.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class EmployeeEndToEnd {
    @LocalServerPort
    private int port;

    @Autowired
    private AddressRepository addressRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private EmployeeRepository employeeRepo;

    @BeforeEach
    public void setup() {
        RestAssured.port = this.port;
    }

    //Helper functions

    private Address createAndSaveAddress(String unit, String street, String city, String state, String postCode) {
        Address address = new Address();
        address.setUnitNumber(unit);
        address.setStreetAddress(street);
        address.setAddressLine2("Suburb");
        address.setCity(city);
        address.setStateProvinceRegion(state);
        address.setCountry("Aus");
        address.setPostalCode(postCode);
        this.addressRepo.saveAndFlush(address);
        return address;
    }

    private Role createAndSaveRole(String name, SeniorityLevel seniorityLevel, Department department) {
        Role role = new Role();
        role.setName(name);
        role.setSeniorityLevel(seniorityLevel);
        role.setDepartment(department);
        this.roleRepo.saveAndFlush(role);
        return role;
    }

    private Employee createEmployee(String firstName, String lastName, String middleName, Pronouns pronouns, String preferredName, String emailAddress, String phoneNumber, Address address, Role role, Employee manager, WorkSetup workSetup, EmploymentType employmentType, LocalDate startDate, LocalDate lastDate, Boolean isCurrentlyEmployed) {
        Employee employee = new Employee();
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setMiddleName(middleName);
        employee.setPronouns(pronouns);
        employee.setPreferredName(preferredName);
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

    private Employee createSarah() {
        Address address = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Role role = createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);
        
        return createEmployee(
            "Sarah",
            "Jenkins",
            "Marie",
            Pronouns.SHE_HER,
            "SJ",
            "sarah.jenkins@mycompany.com",
            "+61412345678",
            address,
            role,
            null,
            WorkSetup.ON_SITE,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 3, 15),
            null,
            true
        );
    }

    private Employee createAlex(Employee manager) {
        Address address = createAndSaveAddress("2B", "Cockatoo Lane", "Brisbane", "QLD", "3000");
        Role role = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        
        return createEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "alex.rivera@example.com",
            "+61498765432",
            address,
            role,
            manager,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 8, 1),
            null,
            true
        );
    }

    // getAll

    @Test
    public void getAllEmployees_NoEmployees_ReturnsOKAndEmptyArray() {
        // act
        given().when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(0));
    }

    @Test
    public void getAllEmployees_EmployeesInDB_ReturnsOKAndArrayOfEmployees() {
        // arrange
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        //act
        given().when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(2))
        .body("firstName", hasItems("Sarah", "Alex"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }

    // getAll - search queries

    @Test
    public void getAllEmployees_SearchByPartialFirstName_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("search", "sara")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("firstName", hasItem("Sarah"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }

    @Test
    public void getAllEmployees_SearchByLastName_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("search", "jenkins")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("firstName", hasItem("Sarah"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }

    @Test
    public void getAllEmployees_SearchByFullName_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("search", "alex river")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("firstName", hasItem("Alex"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }

    @Test
    public void getAllEmployees_SearchByEmailAddress_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("search", "alex.rivera@example.co")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("firstName", hasItem("Alex"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }
    
     @Test
    public void getAllEmployees_SearchByRoleName_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("search", "Senior Software Developer")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("firstName", hasItem("Sarah"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }
    
    @Test
    public void getAllEmployees_SearchByWorkSetupSubString_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("search", "site")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("firstName", hasItem("Sarah"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }
    
    @Test
    public void getAllEmployees_NoMatches_ReturnsEmptyArray() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("search", "no matches")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(0));
    }

    // getAll - specific query

    @Test
    public void getAllEmployees_FilterByFirstAndLatName_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("firstName", "Sarah").param("lastName", "jenkin")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("firstName", hasItem("Sarah"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }
    
    @Test
    public void getAllEmployees_FilterByWorkSetUp_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("workSetup", "HYBRID")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("firstName", hasItem("Alex"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }
    
    @Test
    public void getAllEmployees_FilterByRoleId_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        Long roleId = employee2.getRole().getId();
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("roleId", roleId)
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("firstName", hasItem("Alex"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }

    @Test
    public void getAllEmployees_FilterByRoleName_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("roleName", "Senior Software")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("firstName", hasItem("Sarah"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }
    
    @Test
    public void getAllEmployees_FilterByStartDateRange_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("startDateFrom", "2021-01-01").param("startDateTo", "2021-04-01")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(1))
        .body("firstName", hasItem("Sarah"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }
    
    @Test
    public void getAllEmployees_FilterByCurrentlyEmployedStatus_ReturnsMatchingEmployee() {
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Employee employee2 = createAlex(employee1);
        this.employeeRepo.saveAndFlush(employee2);
        // act
        given().param("isCurrentlyEmployed", "true")
        .when().get("/employees")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(2))
        .body("firstName", hasItems("Sarah", "Alex"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-list-schema.json")); 
    }

    
    // getById

    @Test
    public void getEmployeeById_ValidId_ReturnsOKAndEmployee() {
        // arrange
        Employee employee1 = createSarah();
        this.employeeRepo.saveAndFlush(employee1);
        Long employeeId = employee1.getId();
        //act
        given().when().get("/employees/" + employeeId)
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("firstName", equalTo("Sarah"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-schema.json")); 
    }

    @Test
    public void getEmployeeById_IdNotInDB_ReturnsNotFound() {
        //act
        given().when().get("/employees/1")
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find employee with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void getEmployeeById_InvlaidIdType_ReturnsBadRequest() {
         //act
        given().when().get("/employees/a")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    // create

    @Test
    public void createEmployee_ValidDto_ReturnsOKAndCreatedEmployee() {
        // arrange
        Employee manager = createSarah();
        Address address = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Long addressId = address.getId();
        Role role = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Long roleId = role.getId();
        this.employeeRepo.saveAndFlush(manager);
        Long managerId = manager.getId();

        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Alex");
        data.setLastName("Rivera");
        data.setMiddleName(null);
        data.setPreferredName("Al");
        data.setPronouns(Pronouns.HE_HIM);
        data.setPhoneNumber("+61498765432");
        data.setAddressId(addressId);
        data.setRoleId(roleId);
        data.setManagerId(managerId);
        data.setWorkSetup(WorkSetup.HYBRID);
        data.setEmploymentType(EmploymentType.FULL_TIME_PERMANENT);
        data.setStartDate(LocalDate.of(2023, 8, 1));
        data.setLastDate(null);
        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/employees")
        // assert
        .then().statusCode(HttpStatus.CREATED.value())
        .body("firstName", equalTo("Alex"))
        .body("address.unitNumber", equalTo("1A"))
        .body("role.name", equalTo("Software Developer"))
        .body("manager.fullName", equalTo("Sarah Jenkins"))
        .body("emailAddress", equalTo("alex.rivera@mycompany.com"))
        .body("isCurrentlyEmployed", equalTo(true))
        .body(matchesJsonSchemaInClasspath("schemas/employee-schema.json"));
    }

    @Test
    public void createEmployee_InvalidDto_ReturnsBadRequest() {
        // arrange
        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("");
        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/employees")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void createEmployee_NoBody_ReturnsBadRequest() {
        //act
        given().contentType(ContentType.JSON)
        .when().post("/employees")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void createEmployee_RoleNotInDB_ReturnsUnprocessableContent() {
        // arrange
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Long addressId = address1.getId();

        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Alex");
        data.setLastName("Rivera");
        data.setMiddleName(null);
        data.setPreferredName("Al");
        data.setPronouns(Pronouns.HE_HIM);
        data.setPhoneNumber("+61498765432");
        data.setAddressId(addressId);
        data.setRoleId(1L);
        data.setManagerId(null);
        data.setWorkSetup(WorkSetup.HYBRID);
        data.setEmploymentType(EmploymentType.FULL_TIME_PERMANENT);
        data.setStartDate(LocalDate.of(2023, 8, 1));
        data.setLastDate(null);
        data.setIsCurrentlyEmployed(true);
        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/employees")
        // assert
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("No role with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void createEmployee_AddressNotInDB_ReturnsUnprocessableContent() {
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Long roleId = role1.getId();

        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Alex");
        data.setLastName("Rivera");
        data.setMiddleName(null);
        data.setPreferredName("Al");
        data.setPronouns(Pronouns.HE_HIM);
        data.setPhoneNumber("+61498765432");
        data.setAddressId(1L);
        data.setRoleId(roleId);
        data.setManagerId(null);
        data.setWorkSetup(WorkSetup.HYBRID);
        data.setEmploymentType(EmploymentType.FULL_TIME_PERMANENT);
        data.setStartDate(LocalDate.of(2023, 8, 1));
        data.setLastDate(null);
        data.setIsCurrentlyEmployed(true);
        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/employees")
        // assert
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("No address with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void createEmployee_ManagerNotInDB_ReturnsUnprocessableContent() {
        // arrange
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Long addressId = address1.getId();
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Long roleId = role1.getId();

        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Alex");
        data.setLastName("Rivera");
        data.setMiddleName(null);
        data.setPreferredName("Al");
        data.setPronouns(Pronouns.HE_HIM);
        data.setPhoneNumber("+61498765432");
        data.setAddressId(addressId);
        data.setRoleId(roleId);
        data.setManagerId(1L);
        data.setWorkSetup(WorkSetup.HYBRID);
        data.setEmploymentType(EmploymentType.FULL_TIME_PERMANENT);
        data.setStartDate(LocalDate.of(2023, 8, 1));
        data.setLastDate(null);
        data.setIsCurrentlyEmployed(true);
        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/employees")
        // assert
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("No manager with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void createEmployee_InvalidDates_ReturnsUnprocessableContent() {
        // arrange
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Long addressId = address1.getId();
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Long roleId = role1.getId();


        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Alex");
        data.setLastName("Rivera");
        data.setMiddleName(null);
        data.setPreferredName("Al");
        data.setPronouns(Pronouns.HE_HIM);
        data.setPhoneNumber("+61498765432");
        data.setAddressId(addressId);
        data.setRoleId(roleId);
        data.setManagerId(null);
        data.setWorkSetup(WorkSetup.HYBRID);
        data.setEmploymentType(EmploymentType.FULL_TIME_PERMANENT);
        data.setStartDate(LocalDate.of(2023, 8, 1));
        data.setLastDate(LocalDate.of(2020, 7, 16));
        data.setIsCurrentlyEmployed(true);
        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/employees")
        // assert
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("Start date cannot be after employee's last date."))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void createEmployee_WhenEmailGeneratedExists_CreatesEmailWithIncrementedNumber() {
        // arrange
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Long addressId = address1.getId();
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Long roleId = role1.getId();

        createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);

        Employee manager = createSarah();
        this.employeeRepo.saveAndFlush(manager);
        Long managerId = manager.getId();

        CreateEmployeeRequest data = new CreateEmployeeRequest();
        data.setFirstName("Sarah");
        data.setLastName("Jenkins");
        data.setMiddleName(null);
        data.setPreferredName("Al");
        data.setPronouns(Pronouns.HE_HIM);
        data.setPhoneNumber("+61498765432");
        data.setAddressId(addressId);
        data.setRoleId(roleId);
        data.setManagerId(managerId);
        data.setWorkSetup(WorkSetup.HYBRID);
        data.setEmploymentType(EmploymentType.FULL_TIME_PERMANENT);
        data.setStartDate(LocalDate.of(2023, 8, 1));
        data.setLastDate(null);
        data.setIsCurrentlyEmployed(true);
        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/employees")
        // assert
        .then().statusCode(HttpStatus.CREATED.value())
        .body("emailAddress", equalTo("sarah.jenkins1@mycompany.com"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-schema.json"));
    }

    // updateByid

    @Test
    public void updateEmployeeById_ValidDtoAndEmployeeInDB_ReturnsOKAndCreatedEmployee() {
        // arrange
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Long addressId = address1.getId();
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Long roleId = role1.getId();

        Employee manager = createSarah();
        this.employeeRepo.saveAndFlush(manager);
        Long managerId = manager.getId();
        Employee employee2 = createAlex(manager);
        this.employeeRepo.saveAndFlush(employee2);
        Long employeeId = employee2.getId();

        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setFirstName("John");
        data.setLastName("Smith");
        data.setMiddleName(null);
        data.setPreferredName("Al");
        data.setPronouns(Pronouns.HE_HIM);
        data.setEmailAddress("john.smith@mycompany.com");
        data.setPhoneNumber("+61423456789");
        data.setAddressId(addressId);
        data.setRoleId(roleId);
        data.setManagerId(managerId);
        data.setWorkSetup(WorkSetup.REMOTE);
        data.setEmploymentType(EmploymentType.PART_TIME_PERMANENT);
        data.setStartDate(LocalDate.of(2023, 8, 1));
        data.setLastDate(null);
        data.setIsCurrentlyEmployed(false);
        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/employees/" + employeeId)
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("firstName", equalTo("John"))
        .body("address.unitNumber", equalTo("1A"))
        .body("role.name", equalTo("Software Developer"))
        .body("workSetup", equalTo("Remote"))
        .body("employmentType", equalTo("Part-Time Permanent"))
        .body("manager.fullName", equalTo("Sarah Jenkins"))
        .body("emailAddress", equalTo("john.smith@mycompany.com"))
        .body(matchesJsonSchemaInClasspath("schemas/employee-schema.json"));
    }

    @Test
    public void updateEmployeeById_EmployeeNotInDB_ReturnsNotFound() {
        // arrange
        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setFirstName("John");
        data.setLastName("Smith");
        data.setMiddleName(null);
        data.setPreferredName("Al");
        data.setPronouns(Pronouns.HE_HIM);
        data.setEmailAddress("john.smith@mycompany.com");
        data.setPhoneNumber("+61423456789");
        data.setWorkSetup(WorkSetup.REMOTE);
        data.setEmploymentType(EmploymentType.PART_TIME_PERMANENT);
        data.setStartDate(LocalDate.of(2023, 8, 1));
        data.setLastDate(null);
        data.setIsCurrentlyEmployed(false);
        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/employees/1")
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find employee with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void updateEmployeeById_InvalidDto_ReturnsBadRequest() {
        // arrange
        Employee manager = createSarah();
        this.employeeRepo.saveAndFlush(manager);
        Employee employee2 = createAlex(manager);
        this.employeeRepo.saveAndFlush(employee2);
        Long employeeId = employee2.getId();

        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setFirstName("");        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/employees/" + employeeId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void updateEmployeeById_NoBody_ReturnsBadRequest() {
        Employee manager = createSarah();
        this.employeeRepo.saveAndFlush(manager);
        Employee employee2 = createAlex(manager);
        this.employeeRepo.saveAndFlush(employee2);
        Long employeeId = employee2.getId();
        //act
        given().contentType(ContentType.JSON)
        .when().patch("/employees/" + employeeId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void updateEmployeeById_InvalidDates_ReturnsUnprocessableContent() {
        Employee manager = createSarah();
        this.employeeRepo.saveAndFlush(manager);
        Employee employee2 = createAlex(manager);
        this.employeeRepo.saveAndFlush(employee2);
        Long employeeId = employee2.getId();

        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setLastDate(LocalDate.of(2020, 6, 1));        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/employees/" + employeeId)
        // assert
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void updateEmployeeById_RoleNotInDB_ReturnsUnprocessableContent() {
        Employee employee1 = createAlex(null);
        Long roleId = employee1.getRole().getId();
        this.employeeRepo.saveAndFlush(employee1);
        Long employeeId = employee1.getId();

        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setRoleId(roleId + 1);        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/employees/" + employeeId)
        // assert
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("No role with id " + (roleId + 1)))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void updateEmployeeById_AddressNotInDB_ReturnsUnprocessableContent() {
        Employee employee1 = createAlex(null);
        Long addressId = employee1.getAddress().getId();
        this.employeeRepo.saveAndFlush(employee1);
        Long employeeId = employee1.getId();

        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setAddressId(addressId + 1);        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/employees/" + employeeId)
        // assert
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("No address with id " + (addressId + 1)))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void updateEmployeeById_ManagerNotInDB_ReturnsUnprocessableContent() {
        Employee employee1 = createAlex(null);
        this.employeeRepo.saveAndFlush(employee1);
        Long employeeId = employee1.getId();

        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setManagerId(employeeId + 1);        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/employees/" + employeeId)
        // assert
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("No manager with id " + (employeeId + 1)))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void updateEmployeeById_WhenEmailAddressAlreadyInUse_ReturnsBadRequest() {
        createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);
        Employee employee1 = createAlex(null);
        employee1.setEmailAddress("sarah.jenkins@example.com");
        this.employeeRepo.saveAndFlush(employee1);

        Employee employee2 = createSarah();
        employee2.setEmailAddress("susan.jenkins@example.com");
        this.employeeRepo.saveAndFlush(employee2);
        Long employeeId = employee2.getId();

        UpdateEmployeeRequest data = new UpdateEmployeeRequest();
        data.setEmailAddress("sarah.jenkins@example.com");        
        //act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/employees/" + employeeId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test
    public void deleteEmployeeById_ValidId_ReturnNoContent() {
        // arrange
        Employee employee1 = createAlex(null);
        this.employeeRepo.saveAndFlush(employee1);
        Long employeeId = employee1.getId();
        //act
        given().when().delete("/employees/" + employeeId)
        // assert
        .then().statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    public void deleteEmployeeById_IdNotInDB_ReturnNotFound() {
        //act
        given().when().delete("/employees/1")
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find employee with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void deleteEmployeeById_InvalidIdType_ReturnBadRequest() {
         //act
        given().when().delete("/employees/a")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void deleteEmployeeById_EmployeeIsManagerToOtherEmployees_ReturnsBadRequest() {
        // arrange
        Employee manager = createSarah();
        this.employeeRepo.saveAndFlush(manager);
        Long managerId = manager.getId();
        Employee employee2 = createAlex(manager);
        this.employeeRepo.saveAndFlush(employee2);
        //act
        given().when().delete("/employees/" + managerId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }    

    @Test
    public void getAllEmployeeEnums_ReturnOKAndMapOfEnums() {
        // act
        given().when().get("/employees/enums")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasKey("employmentType"))
        .body("$", hasKey("pronouns"))
        .body("$", hasKey("workSetup"))
        .body("employmentType", hasSize(EmploymentType.values().length))
        .body("pronouns", hasSize(Pronouns.values().length))
        .body("workSetup", hasSize(WorkSetup.values().length))
        .body("employmentType[0].label", equalTo("Full-Time Permanent"))
        .body("employmentType[0].value", equalTo("FULL_TIME_PERMANENT"))
        .body("pronouns[0].label", equalTo("He/Him"))
        .body("pronouns[0].value", equalTo("HE_HIM"))
        .body("workSetup[0].label", equalTo("Onsite"))
        .body("workSetup[0].value", equalTo("ON_SITE"));
    }
}
