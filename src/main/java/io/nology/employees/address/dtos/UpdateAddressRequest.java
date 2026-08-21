package io.nology.employees.address.dtos;

import jakarta.validation.constraints.Pattern;

public class UpdateAddressRequest {
    @Pattern(regexp = ".*\\S.*", message = "Unit number cannot be empty")
    private String unitNumber;

    @Pattern(regexp = ".*\\S.*", message = "Street address cannot be empty")
    private String streetAddress;

    @Pattern(regexp = ".*\\S.*", message = "Address line 2 cannot be empty")
    private String addressLine2;

    @Pattern(regexp = ".*\\S.*", message = "City cannot be empty")
    private String city;

    @Pattern(regexp = ".*\\S.*", message = "State/Province/Region cannot be empty")
    private String stateProvinceRegion;

    @Pattern(regexp = ".*\\S.*", message = "Postal code cannot be empty")
    private String postalCode;

    @Pattern(regexp = ".*\\S.*", message = "Country cannot be empty")
    private String country;

    public String getUnitNumber() {
        return unitNumber;
    }

    public void setUnitNumber(String unitNumber) {
        this.unitNumber = unitNumber;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateProvinceRegion() {
        return stateProvinceRegion;
    }

    public void setStateProvinceRegion(String stateProvinceRegion) {
        this.stateProvinceRegion = stateProvinceRegion;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
