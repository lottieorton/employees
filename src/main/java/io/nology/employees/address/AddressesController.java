package io.nology.employees.address;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.nology.employees.address.dtos.AddressResponse;
import io.nology.employees.address.dtos.CreateAddressRequest;
import io.nology.employees.address.dtos.UpdateAddressRequest;
import io.nology.employees.address.entities.Address;
import io.nology.employees.common.exceptions.NotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/addresses")
@Tag(name = "Addresses Controller")
public class AddressesController {
    
    private final AddressService addressService;

    public AddressesController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping()
    public ResponseEntity<List<AddressResponse>> findAllAddresses() {
        List<Address> allAddresses = this.addressService.findAll();
        return ResponseEntity.ok(AddressResponse.of(allAddresses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> findAddressById(@PathVariable Long id) {
        Address result = this.addressService.findById(id)
        .orElseThrow(() -> new NotFoundException("Could not find address with id " + id));
        return ResponseEntity.ok(AddressResponse.of(result));
    }

    @PostMapping()
    public ResponseEntity<AddressResponse> createAddress(@Valid @RequestBody CreateAddressRequest data) {
        Address result = this.addressService.create(data);
        return new ResponseEntity<AddressResponse>(AddressResponse.of(result), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<AddressResponse> updateAddressById(@PathVariable Long id, @Valid @RequestBody UpdateAddressRequest data) {
        Address result = this.addressService.updateById(id, data)
        .orElseThrow(() -> new NotFoundException("Could not find address with id " + id));
        return ResponseEntity.ok(AddressResponse.of(result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddressById(@PathVariable Long id) {
        boolean isDeleted = this.addressService.deleteById(id);
        if(isDeleted) {
            return ResponseEntity.noContent().build();
        }
        throw new NotFoundException("Could not find address with id " + id);
    }
    
}
