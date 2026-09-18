package io.nology.employees.role;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.jdbc.Sql;

import io.nology.employees.role.dtos.CreateRoleRequest;
import io.nology.employees.role.dtos.UpdateRoleRequest;
import io.nology.employees.role.entities.Department;
import io.nology.employees.role.entities.Role;
import io.nology.employees.role.entities.SeniorityLevel;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(scripts = "/sql/cleanup.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class RoleEndToEndTest {
    @LocalServerPort
    private int port;

    @Autowired
    private RoleRepository roleRepo;

    @BeforeEach
    public void setup() {
        RestAssured.port = this.port;
    }

    private Long createAndSaveRole(String name, SeniorityLevel seniorityLevel, Department department) {
        Role role = new Role();
        role.setName(name);
        role.setSeniorityLevel(seniorityLevel);
        role.setDepartment(department);
        this.roleRepo.saveAndFlush(role);
        return role.getId();
    }

    // getAll

    @Test
    public void getAllRoles_NoRoles_ReturnsOKAndEmptyArray() {
        // act
        given().when().get("/roles")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(0));
    }

    @Test
    public void getAllRoles_RolesInDB_ReturnsOKAndArrayOfRoles() {
        // arrange
        createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        createAndSaveRole("Senior Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING);
        // act
        given().when().get("/roles")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(2))
        .body("name", hasItems("Software Developer", "Senior Software Developer"))
        .body("seniorityLevel", hasItems("Junior", "Senior"))
        .body("department", hasItems("Engineering", "Engineering"))
        .body(matchesJsonSchemaInClasspath("schemas/role-list-schema.json"));
    }

    // getById

    @Test
    public void getRoleById_ValidId_ReturnsOKAndRole() {
        // arrange
        Long roleId = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        // act
        given().when().get("/roles/" + roleId)
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("name", equalTo("Software Developer"))
        .body("seniorityLevel", equalTo("Junior"))
        .body("department", equalTo("Engineering"))
        .body(matchesJsonSchemaInClasspath("schemas/role-schema.json"));
    }

    @Test
    public void getRoleById_IdNotInDB_ReturnsNotFound() {
        // act
        given().when().get("/roles/1")
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find role with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void getRoleById_InvalidIdType_ReturnsBadRequest() {
        // act
        given().when().get("/roles/a")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    // create

    @Test void createRole_ValidDto_ReturnsCreatedAndCreatedRole() {
        // arrange
        CreateRoleRequest data = new CreateRoleRequest();
        data.setName("Software Developer");
        data.setSeniorityLevel(SeniorityLevel.JUNIOR);
        data.setDepartment(Department.ENGINEERING);

        // act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/roles")
        // assert
        .then().statusCode(HttpStatus.CREATED.value())
        .body("name", equalTo("Software Developer"))
        .body("seniorityLevel", equalTo("Junior"))
        .body("department", equalTo("Engineering"))
        .body(matchesJsonSchemaInClasspath("schemas/role-schema.json"));
    }

    @Test void createRole_InvalidDto_ReturnsBadRequest() {
        // arrange
        CreateRoleRequest data = new CreateRoleRequest();
        data.setName("");
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/roles")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    @Test void createRole_NoBody_ReturnsBadRequest() {
        // act
        given().contentType(ContentType.JSON)
        .when().post("/roles")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json")); 
    }

    // updateById

    @Test
    public void updateRoleById_ValidDtoAndId_ReturnsOKAndUpdatedRole() {
        // arrange
        Long roleId = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);

        UpdateRoleRequest data = new UpdateRoleRequest();
        data.setName("Senior Software Developer");
        data.setSeniorityLevel(SeniorityLevel.SENIOR);
        data.setDepartment(Department.PRODUCT);

        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/roles/" + roleId)
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("name", equalTo("Senior Software Developer"))
        .body("seniorityLevel", equalTo("Senior"))
        .body("department", equalTo("Product"))
        .body(matchesJsonSchemaInClasspath("schemas/role-schema.json")); 
    }

    @Test
    public void updateRoleById_InvalidDto_ReturnsBadRequest() {
        // arrange
        Long roleId = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        UpdateRoleRequest data = new UpdateRoleRequest();
        data.setName("");

        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/roles/" + roleId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));   
    }

    @Test
    public void updateRoleById_NoBody_ReturnsBadRequest() {
        // arrange
        Long roleId = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);

        // act
        given().contentType(ContentType.JSON)
        .when().patch("/roles/" + roleId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));   
    }

    @Test
    public void updateRoleById_IdNotInDB_ReturnsNotFound() {
        // arrange
        UpdateRoleRequest data = new UpdateRoleRequest();
        data.setName("Senior Software Developer");
        data.setSeniorityLevel(SeniorityLevel.SENIOR);
        data.setDepartment(Department.PRODUCT);

        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/roles/1")
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find role with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void updateRoleById_InvalidIdType_ReturnsBadRequest() {
        // arrange
        UpdateRoleRequest data = new UpdateRoleRequest();
        data.setName("Senior Software Developer");
        data.setSeniorityLevel(SeniorityLevel.SENIOR);
        data.setDepartment(Department.PRODUCT);

        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/roles/a")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    // deleteById

    @Test
    public void deleteRoleById_ValidId_ReturnsNoContent() {
        // arrange
        Long roleId = createAndSaveRole("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING);
        // act
        given().when().delete("/roles/" + roleId)
        // assert
        .then().statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    public void deleteRoleById_IdNotInDB_ReturnsNotFound() {
        // act
        given().when().delete("/roles/1")
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find role with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

     @Test
    public void deleteRoleById_InvalidIdType_ReturnsBadRequest() {
        // act
        given().when().delete("/roles/a")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }
}
