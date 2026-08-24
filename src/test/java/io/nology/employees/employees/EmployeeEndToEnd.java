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

    private Employee createAndSaveEmployee(String firstName, String lastName, String middleName, Pronouns pronouns, String preferredName, String emailAddress, String phoneNumber, Address address, Role role, Employee manager, WorkSetup workSetup, EmploymentType employmentType, LocalDate startDate, LocalDate lastDate, Boolean isCurrentlyEmployed) {
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
        this.employeeRepo.saveAndFlush(employee);
        return employee;
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
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Role role2 = createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);
        Employee employee1 = createAndSaveEmployee(
            "Sarah",
            "Jenkins",
            "Marie",
            Pronouns.SHE_HER,
            "SJ",
            "sarah.jenkins@example.com",
            "+61412345678",
            address1,
            role2,
            null,
            WorkSetup.ON_SITE,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 3, 15),
            null,
            true
        );
        createAndSaveEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "alex.rivera@example.com",
            "+61498765432",
            address1,
            role1,
            employee1,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 8, 1),
            null,
            true
        );
        
        //act
        given().when().get("/employees")
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
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Role role1 = createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);
        Employee employee1 = createAndSaveEmployee(
            "Sarah",
            "Jenkins",
            "Marie",
            Pronouns.SHE_HER,
            "SJ",
            "sarah.jenkins@example.com",
            "+61412345678",
            address1,
            role1,
            null,
            WorkSetup.ON_SITE,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 3, 15),
            null,
            true
        );
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
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Long addressId = address1.getId();
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Long roleId = role1.getId();
        createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);
        Employee manager = createAndSaveEmployee(
            "Sarah",
            "Jenkins",
            "Marie",
            Pronouns.SHE_HER,
            "SJ",
            "sarah.jenkins@example.com",
            "+61412345678",
            address1,
            role1,
            null,
            WorkSetup.ON_SITE,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 3, 15),
            null,
            true
        );
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
        .body("address.formattedAddress", equalTo("Palm Tree Lane, Sydney"))
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

        Employee manager = createAndSaveEmployee(
            "Sarah",
            "Jenkins",
            "Marie",
            Pronouns.SHE_HER,
            "SJ",
            "sarah.jenkins@mycompany.com",
            "+61412345678",
            address1,
            role1,
            null,
            WorkSetup.ON_SITE,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 3, 15),
            null,
            true
        );
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
        Role role2 = createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);

        Employee manager = createAndSaveEmployee(
            "Sarah",
            "Jenkins",
            "Marie",
            Pronouns.SHE_HER,
            "SJ",
            "sarah.jenkins@example.com",
            "+61412345678",
            address1,
            role2,
            null,
            WorkSetup.ON_SITE,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 3, 15),
            null,
            true
        );
        Long managerId = manager.getId();

        Employee employee2 = createAndSaveEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "alex.rivera@example.com",
            "+61498765432",
            address1,
            role1,
            manager,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 8, 1),
            null,
            true
        );
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
        .body("address.formattedAddress", equalTo("Palm Tree Lane, Sydney"))
        .body("role.name", equalTo("Software Developer"))
        .body("workSetup", equalTo("REMOTE"))
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
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Role role2 = createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);

        Employee manager = createAndSaveEmployee(
            "Sarah",
            "Jenkins",
            "Marie",
            Pronouns.SHE_HER,
            "SJ",
            "sarah.jenkins@example.com",
            "+61412345678",
            address1,
            role2,
            null,
            WorkSetup.ON_SITE,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 3, 15),
            null,
            true
        );

        Employee employee2 = createAndSaveEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "alex.rivera@example.com",
            "+61498765432",
            address1,
            role1,
            manager,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 8, 1),
            null,
            true
        );
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
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Role role2 = createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);

        Employee manager = createAndSaveEmployee(
            "Sarah",
            "Jenkins",
            "Marie",
            Pronouns.SHE_HER,
            "SJ",
            "sarah.jenkins@example.com",
            "+61412345678",
            address1,
            role2,
            null,
            WorkSetup.ON_SITE,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 3, 15),
            null,
            true
        );

        Employee employee2 = createAndSaveEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "alex.rivera@example.com",
            "+61498765432",
            address1,
            role1,
            manager,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 8, 1),
            null,
            true
        );
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
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Role role2 = createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);

        Employee manager = createAndSaveEmployee(
            "Sarah",
            "Jenkins",
            "Marie",
            Pronouns.SHE_HER,
            "SJ",
            "sarah.jenkins@example.com",
            "+61412345678",
            address1,
            role2,
            null,
            WorkSetup.ON_SITE,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 3, 15),
            null,
            true
        );
        Employee employee2 = createAndSaveEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "alex.rivera@example.com",
            "+61498765432",
            address1,
            role1,
            manager,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 8, 1),
            null,
            true
        );
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
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Long roleId = role1.getId();

        Employee employee2 = createAndSaveEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "alex.rivera@example.com",
            "+61498765432",
            address1,
            role1,
            null,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2023, 8, 1),
            null,
            true
        );
        Long employeeId = employee2.getId();

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
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Long addressId = address1.getId();
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);

        Employee employee2 = createAndSaveEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "alex.rivera@example.com",
            "+61498765432",
            address1,
            role1,
            null,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2023, 8, 1),
            null,
            true
        );
        Long employeeId = employee2.getId();

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
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);

        Employee employee2 = createAndSaveEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "alex.rivera@example.com",
            "+61498765432",
            address1,
            role1,
            null,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2023, 8, 1),
            null,
            true
        );
        Long employeeId = employee2.getId();

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
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);

        createAndSaveEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "sarah.jenkins@example.com",
            "+61498765432",
            address1,
            role1,
            null,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2023, 8, 1),
            null,
            true
        );

        Employee employee2 = createAndSaveEmployee(
            "Sarah",
            "Jenkins",
            "Marie",
            Pronouns.SHE_HER,
            "SJ",
            "susan.jenkins@example.com",
            "+61412345678",
            address1,
            role1,
            null,
            WorkSetup.ON_SITE,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 3, 15),
            null,
            true
        );
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
        Address address1 = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        Role role1 = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        Employee employee2 = createAndSaveEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "alex.rivera@example.com",
            "+61498765432",
            address1,
            role1,
            null,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2023, 8, 1),
            null,
            true
        );
        Long employeeId = employee2.getId();
        
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
}
