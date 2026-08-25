package io.nology.employees.address;

import org.springframework.data.jpa.repository.JpaRepository;

import io.nology.employees.address.entities.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
    
}
