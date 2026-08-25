package io.nology.employees.address.dtos;

import java.util.List;

import io.nology.employees.address.entities.Address;

public record AddressResponse (Long id, String unitNumber, String streetAddress, String addressLine2, String city, String stateProvinceRegion, String postalCode, String country) {
    public static AddressResponse of(Address address) {
        return new AddressResponse(address.getId(), address.getUnitNumber(), address.getStreetAddress(), address.getAddressLine2(), address.getCity(), address.getStateProvinceRegion(), address.getPostalCode(), address.getCountry());
    }

    public static List<AddressResponse> of(List<Address> addresses) {
        return addresses.stream().map(r -> AddressResponse.of(r)).toList();
    }
}