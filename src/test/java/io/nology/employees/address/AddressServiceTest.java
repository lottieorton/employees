package io.nology.employees.address;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import io.nology.employees.address.dtos.CreateAddressRequest;
import io.nology.employees.address.dtos.UpdateAddressRequest;
import io.nology.employees.address.entities.Address;

@ExtendWith(MockitoExtension.class)
public class AddressServiceTest {
    
    @Mock
    private AddressRepository repo;

    @Mock
    private ModelMapper mapper;

    @InjectMocks
    private AddressService addressService;

    @Test
    public void findAll_CallsFindAll() {
        this.addressService.findAll();
        verify(this.repo).findAll();
    }

    @Test
    public void findById_CallsFindById() {
        this.addressService.findById(1L);
        verify(this.repo).findById(1L);
    }

    @Test
    public void create_SavesAddressInDB() {
        // arrange
        CreateAddressRequest data = new CreateAddressRequest();
        data.setUnitNumber("1A");
        data.setStreetAddress("Palm Tree Lane");
        data.setAddressLine2("Sunrise Bay");
        data.setCity("Sydney");
        data.setStateProvinceRegion("NSW");
        data.setPostalCode("2000");
        data.setCountry("Aus");

        Address testAddress = new Address();
        testAddress.setUnitNumber("1A");
        testAddress.setStreetAddress("Palm Tree Lane");
        testAddress.setAddressLine2("Sunrise Bay");
        testAddress.setCity("Sydney");
        testAddress.setStateProvinceRegion("NSW");
        testAddress.setPostalCode("2000");
        testAddress.setCountry("Aus");

        when(this.mapper.map(data, Address.class)).thenReturn(testAddress);
        when(this.repo.saveAndFlush(any(Address.class))).thenAnswer(a -> {
            Address savedAddress = a.getArgument(0);
            savedAddress.setId(1L);
            return savedAddress;
        });

        // act
        Address result = this.addressService.create(data);
        // assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("1A", result.getUnitNumber());

        verify(this.repo).saveAndFlush(testAddress);
    }

    @Test
    public void updateById_WhenAddressExists_SavesUpdatedAddressInDB() {
        // arrange
        UpdateAddressRequest data = new UpdateAddressRequest();
        data.setUnitNumber("2B");
        data.setStreetAddress("Cockatoo Lane");
        data.setAddressLine2("Emu Plains");

        Address testAddress = new Address();
        testAddress.setUnitNumber("1A");
        testAddress.setStreetAddress("Palm Tree Lane");
        testAddress.setAddressLine2("Sunrise Bay");
        testAddress.setCity("Sydney");
        testAddress.setStateProvinceRegion("NSW");
        testAddress.setPostalCode("2000");
        testAddress.setCountry("Aus");

        when(this.repo.findById(1L)).thenReturn(Optional.of(testAddress));
        doAnswer(invocation -> {
            UpdateAddressRequest dto = invocation.getArgument(0);
            Address targetAddress = invocation.getArgument(1);
            targetAddress.setUnitNumber(dto.getUnitNumber());
            targetAddress.setStreetAddress("Cockatoo Lane");
            targetAddress.setAddressLine2("Emu Plains");
            return null;
        }).when(mapper).map(any(UpdateAddressRequest.class), any(Address.class));
        when(this.repo.saveAndFlush(any(Address.class))).thenAnswer(a -> {
            return a.getArgument(0);
        });

        // act
        Optional<Address> result = this.addressService.updateById(1L, data);
        // assert
        assertTrue(result.isPresent());
        assertEquals("2B", result.get().getUnitNumber());
        assertEquals("Cockatoo Lane", result.get().getStreetAddress());
        assertEquals("Emu Plains", result.get().getAddressLine2());

        verify(this.repo).findById(1L);
        verify(this.mapper).map(data, testAddress);
        verify(this.repo).saveAndFlush(testAddress);
    }

    @Test
    public void updateById_WhenAddressDoesNotExist_ReturnsEmpty() {
        // arrange
        UpdateAddressRequest data = new UpdateAddressRequest();
        data.setUnitNumber("2B");
        data.setStreetAddress("Cockatoo Lane");
        data.setAddressLine2("Emu Plains");
        data.setCity("Brisbane");
        data.setStateProvinceRegion("QLD");
        data.setPostalCode("2000");
        data.setCountry("Aus");

        when(this.repo.findById(1L)).thenReturn(Optional.empty());

        // act
        Optional<Address> result = this.addressService.updateById(1L, data);
        // assert
        assertTrue(result.isEmpty());

        verify(this.repo).findById(1L);
        verify(this.mapper, never()).map(any(UpdateAddressRequest.class), any(Address.class));
        verify(this.repo, never()).saveAndFlush(any(Address.class));
    }

    @Test
    public void deleteById_WhenAddressExists_DeletesAddressInDB() {
        // arrange
        Address testAddress = new Address();
        testAddress.setUnitNumber("1A");
        testAddress.setStreetAddress("Palm Tree Lane");
        testAddress.setAddressLine2("Sunrise Bay");
        testAddress.setCity("Sydney");
        testAddress.setStateProvinceRegion("NSW");
        testAddress.setPostalCode("2000");
        testAddress.setCountry("Aus");

        when(this.repo.findById(1L)).thenReturn(Optional.of(testAddress));
        // act
        boolean result = this.addressService.deleteById(1L);

        // assert
        assertTrue(result);

        verify(this.repo).findById(1L);
        verify(this.repo).delete(testAddress);
    }

    @Test
    public void deleteById_WhenAddressDoesNotExist_ReturnsFalse() {
        // arrange
        when(this.repo.findById(1L)).thenReturn(Optional.empty());
        // act
        boolean result = this.addressService.deleteById(1L);

        // assert
        assertFalse(result);

        verify(this.repo).findById(1L);
        verify(this.repo, never()).delete(any(Address.class));
    }
}
