package io.nology.employees.address;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import io.nology.employees.address.dtos.CreateAddressRequest;
import io.nology.employees.address.dtos.UpdateAddressRequest;
import io.nology.employees.address.entities.Address;

@Service
public class AddressService {

    private final AddressRepository repo;
    private final ModelMapper mapper;
    
    public AddressService(AddressRepository repo, ModelMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public List<Address> findAll() {
        return this.repo.findAll();
    }

    public Optional<Address> findById(Long id) {
        return this.repo.findById(id);
    }

    public Address create(CreateAddressRequest data) {
        Address createdAddress = this.mapper.map(data, Address.class);
        this.repo.saveAndFlush(createdAddress);
        return createdAddress;       
    }

    public Optional<Address> updateById(Long id, UpdateAddressRequest data) {
        Optional<Address> result = findById(id);
        if(result.isEmpty()) {
            return result;
        }
        Address foundAddress = result.get();
        this.mapper.map(data, foundAddress);
        this.repo.saveAndFlush(foundAddress);
        return Optional.of(foundAddress);
    }

    public boolean deleteById(Long id) {
        Optional<Address> result = findById(id);
        if(result.isEmpty()) {
            return false;
        }
        this.repo.delete(result.get());
        return true;
    }

}
