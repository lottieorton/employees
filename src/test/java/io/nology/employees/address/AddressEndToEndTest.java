package io.nology.employees.address;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.jdbc.Sql;

import io.nology.employees.address.dtos.CreateAddressRequest;
import io.nology.employees.address.dtos.UpdateAddressRequest;
import io.nology.employees.address.entities.Address;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(scripts = "/sql/cleanup.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class AddressEndToEndTest {
    @LocalServerPort
    private int port;

    @Autowired
    private AddressRepository addressRepo;

    @BeforeEach
    public void setup() {
        RestAssured.port = this.port;
    }

    // Helper functions

    private Long createAndSaveAddress(String unit, String street, String city, String state, String postCode) {
        Address address = new Address();
        address.setUnitNumber(unit);
        address.setStreetAddress(street);
        address.setAddressLine2("Suburb");
        address.setCity(city);
        address.setStateProvinceRegion(state);
        address.setCountry("Aus");
        address.setPostalCode(postCode);
        this.addressRepo.saveAndFlush(address);
        return address.getId();
    }

    // getAll

    @Test
    public void getAllAddresses_NoAddresses_ReturnsOKAndEmptyArray() {
        // act
        given().when().get("/addresses")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(0));
    }

    @Test
    public void getAllAddresses_AddressesInDB_ReturnsOKAndArrayOfAddresses() {
        // arrange
        createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        createAndSaveAddress("2B", "Cockatoo Lane", "Brisbane", "QLD", "3000");
        // act
        given().when().get("/addresses")
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(2))
        .body("unitNumber", hasItems("1A", "2B"))
        .body("streetAddress", hasItems("Palm Tree Lane", "Cockatoo Lane"))
        .body("addressLine2", hasItems("Suburb", "Suburb"))
        .body("city", hasItems("Sydney", "Brisbane"))
        .body("stateProvinceRegion", hasItems("NSW", "QLD"))
        .body("postalCode", hasItems("2000", "3000"))
        .body("country", hasItems("Aus", "Aus"))
        .body(matchesJsonSchemaInClasspath("schemas/address-list-schema.json"));
    }

    // getById

    @Test
    public void getAddressById_ValidId_ReturnsOKAndAddress() {
        // arrange
        Long addressId = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        // act
        given().when().get("/addresses/" + addressId)
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("unitNumber", equalTo("1A"))
        .body("streetAddress", equalTo("Palm Tree Lane"))
        .body("addressLine2", equalTo("Suburb"))
        .body("city", equalTo("Sydney"))
        .body("stateProvinceRegion", equalTo("NSW"))
        .body("postalCode", equalTo("2000"))
        .body("country", equalTo("Aus"))
        .body(matchesJsonSchemaInClasspath("schemas/address-schema.json"));
    }

    @Test
    public void getAddressById_IdNotInDB_ReturnsNotFound() {
        // act
        given().when().get("/addresses/1")
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find address with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void getAddressById_InvalidIdType_ReturnsbadRequest() {
        // act
        given().when().get("/addresses/a")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    // create

    @Test
    public void createAddress_ValidDto_ReturnsOKAndCreatedAddress() {
        // arrange
        CreateAddressRequest data = new CreateAddressRequest();
        data.setUnitNumber("1A");
        data.setStreetAddress("Palm Tree Lane");
        data.setAddressLine2("Sunrise Bay");
        data.setCity("Sydney");
        data.setStateProvinceRegion("NSW");
        data.setPostalCode("2000");
        data.setCountry("Aus");
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/addresses")
        // assert
        .then().statusCode(HttpStatus.CREATED.value())
        .body("unitNumber", equalTo("1A"))
        .body("streetAddress", equalTo("Palm Tree Lane"))
        .body("addressLine2", equalTo("Sunrise Bay"))
        .body("city", equalTo("Sydney"))
        .body("stateProvinceRegion", equalTo("NSW"))
        .body("postalCode", equalTo("2000"))
        .body("country", equalTo("Aus"))
        .body(matchesJsonSchemaInClasspath("schemas/address-schema.json"));
    }

     @Test
    public void createAddress_InvalidDto_ReturnsBadRequest() {
        // arrange
        CreateAddressRequest data = new CreateAddressRequest();
        data.setUnitNumber("");
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().post("/addresses")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

     @Test
    public void createAddress_NoBody_ReturnsBadRequest() {
        // act
        given().contentType(ContentType.JSON)
        .when().post("/addresses")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    // updateById

    @Test
    public void updateAddress_ValidDtoAndId_ReturnsOKAndUpdatedAddress() {
        // arrange
        UpdateAddressRequest data = new UpdateAddressRequest();
        data.setUnitNumber("2B");
        data.setStreetAddress("Cockatoo Lane");
        data.setAddressLine2("Emu Plains");
        data.setCity("Brisbane");
        data.setStateProvinceRegion("QLD");
        data.setPostalCode("2001");
        data.setCountry("Aus");

        Long addressId = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");

        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/addresses/" + addressId)
        // assert
        .then().statusCode(HttpStatus.OK.value())
        .body("unitNumber", equalTo("2B"))
        .body("streetAddress", equalTo("Cockatoo Lane"))
        .body("addressLine2", equalTo("Emu Plains"))
        .body("city", equalTo("Brisbane"))
        .body("stateProvinceRegion", equalTo("QLD"))
        .body("postalCode", equalTo("2001"))
        .body("country", equalTo("Aus"))
        .body(matchesJsonSchemaInClasspath("schemas/address-schema.json"));
    }

    @Test
    public void updateAddress_InvalidDto_ReturnsBadRequest() {
        // arrange
        UpdateAddressRequest data = new UpdateAddressRequest();
        data.setUnitNumber("");

        Long addressId = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");

        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/addresses/" + addressId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void updateAddress_NoBody_ReturnsBadRequest() {
        // arrange
        Long addressId = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");

        // act
        given().contentType(ContentType.JSON)
        .when().patch("/addresses/" + addressId)
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void updateAddress_IdNotInDB_ReturnsNotFound() {
        // arrange
        UpdateAddressRequest data = new UpdateAddressRequest();
        data.setUnitNumber("2B");
        data.setStreetAddress("Cockatoo Lane");
        data.setAddressLine2("Emu Plains");
        data.setCity("Brisbane");
        data.setStateProvinceRegion("QLD");
        data.setPostalCode("2001");
        data.setCountry("Aus");

        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/addresses/1")
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find address with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void updateAddress_InvalidIdType_ReturnsBadRequest() {
        // arrange
        UpdateAddressRequest data = new UpdateAddressRequest();
        data.setUnitNumber("2B");
        data.setStreetAddress("Cockatoo Lane");
        data.setAddressLine2("Emu Plains");
        data.setCity("Brisbane");
        data.setStateProvinceRegion("QLD");
        data.setPostalCode("2001");
        data.setCountry("Aus");
        // act
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/addresses/a")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    // deleteById
    
    @Test
    public void deleteAddress_ValidId_ReturnsNoContent() {
        // arrange
        Long addressId = createAndSaveAddress("1A", "Palm Tree Lane", "Sydney", "NSW", "2000");
        // act
        given().when().delete("/addresses/" + addressId)
        // assert
        .then().statusCode(HttpStatus.NO_CONTENT.value());
    }

    @Test
    public void deleteAddress_IdNotInDB_ReturnsNotFound() {
        // act
        given().when().delete("/addresses/1")
        // assert
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find address with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test
    public void deleteAddress_InvalidIdType_ReturnsBadRequest() {
        // act
        given().when().delete("/addresses/a")
        // assert
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

}
