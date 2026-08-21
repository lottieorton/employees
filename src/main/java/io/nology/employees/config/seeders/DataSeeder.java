package io.nology.employees.config.seeders;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import io.nology.employees.address.AddressRepository;
import io.nology.employees.address.entities.Address;
import io.nology.employees.role.RoleRepository;
import io.nology.employees.role.entities.Role;
import io.nology.employees.role.entities.SeniorityLevel;

@Component
@Profile({"dev"})
public class DataSeeder implements CommandLineRunner {
    private final RoleRepository roleRepo;
    private final AddressRepository addressRepo;

    public DataSeeder(RoleRepository roleRepo, AddressRepository addressRepo) {
        this.roleRepo = roleRepo;
        this.addressRepo = addressRepo;
    }

    private record RoleSeedData(String name, SeniorityLevel seniorityLevel) {}

    @Override
    public void run(String... args) {
        if(roleRepo.count() == 0) {
            List<RoleSeedData> roleData = List.of(
                new RoleSeedData("Software Developer", SeniorityLevel.JUNIOR),
                new RoleSeedData("Software Developer", SeniorityLevel.MID),
                new RoleSeedData("Software Developer", SeniorityLevel.SENIOR),
                new RoleSeedData("QA / Test Engineer", SeniorityLevel.MID),
                new RoleSeedData("DevOps Engineer", SeniorityLevel.SENIOR),
                new RoleSeedData("UI/UX Designer", SeniorityLevel.MID),
                new RoleSeedData("Product Manager", SeniorityLevel.LEAD),
                new RoleSeedData("Engineering Manager", SeniorityLevel.LEAD),
                new RoleSeedData("HR Specialist", SeniorityLevel.MID)
            );   
            List<Role> rolesToSave = new ArrayList<>();

            for(RoleSeedData role: roleData) {
                Role newRole = new Role();
                newRole.setName(role.name());
                newRole.setSeniorityLevel(role.seniorityLevel());
                rolesToSave.add(newRole);
            }
            roleRepo.saveAllAndFlush(rolesToSave);
        }

        if(addressRepo.count() == 0) {
            Address address1 = new Address();
            address1.setUnitNumber("30");
            address1.setStreetAddress("Park Lane");
            address1.setAddressLine2("Leicester Square");
            address1.setCity("London");
            address1.setStateProvinceRegion("Mayfair");
            address1.setPostalCode("E1 1GB");
            address1.setCountry("England");
            addressRepo.saveAndFlush(address1);
            Address address2 = new Address();
            address2.setUnitNumber("86");
            address2.setStreetAddress("Wallaby Way");
            address2.setAddressLine2("Opera House View Parade");
            address2.setCity("Sydney");
            address2.setStateProvinceRegion("Darling Harbour");
            address2.setPostalCode("2000");
            address2.setCountry("Australia");
            addressRepo.saveAndFlush(address2);
        }
    }
}
