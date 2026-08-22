package io.nology.employees.config.seeders;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import io.nology.employees.address.AddressRepository;
import io.nology.employees.address.entities.Address;
import io.nology.employees.employees.EmployeeRepository;
import io.nology.employees.employees.entities.Employee;
import io.nology.employees.employees.entities.EmploymentType;
import io.nology.employees.employees.entities.Pronouns;
import io.nology.employees.employees.entities.WorkSetup;
import io.nology.employees.role.RoleRepository;
import io.nology.employees.role.entities.Department;
import io.nology.employees.role.entities.Role;
import io.nology.employees.role.entities.SeniorityLevel;

@Component
@Profile({"dev"})
public class DataSeeder implements CommandLineRunner {
    private final RoleRepository roleRepo;
    private final AddressRepository addressRepo;
    private final EmployeeRepository employeeRepo;

    public DataSeeder(RoleRepository roleRepo, AddressRepository addressRepo, EmployeeRepository employeeRepo) {
        this.roleRepo = roleRepo;
        this.addressRepo = addressRepo;
        this.employeeRepo = employeeRepo;
    }

    private record RoleSeedData(String name, SeniorityLevel seniorityLevel, Department department) {}

    @Override
    public void run(String... args) {
        List<Role> roles = seedRoles();
        List<Address> addresses = seedAddresses();
        seedEmployees(roles, addresses);
    }

    private List<Role> seedRoles() {
        if(roleRepo.count() > 0) {
            return roleRepo.findAll();
        }
        List<RoleSeedData> roleData = List.of(
            new RoleSeedData("Software Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING),
            new RoleSeedData("Software Developer", SeniorityLevel.MID, Department.ENGINEERING),
            new RoleSeedData("Software Developer", SeniorityLevel.SENIOR, Department.ENGINEERING),
            new RoleSeedData("QA / Test Engineer", SeniorityLevel.MID, Department.QUALITY_ASSURANCE),
            new RoleSeedData("DevOps Engineer", SeniorityLevel.SENIOR, Department.ENGINEERING),
            new RoleSeedData("UI/UX Designer", SeniorityLevel.MID, Department.DESIGN),
            new RoleSeedData("Product Manager", SeniorityLevel.LEAD, Department.PRODUCT),
            new RoleSeedData("Engineering Manager", SeniorityLevel.LEAD, Department.ENGINEERING),
            new RoleSeedData("HR Specialist", SeniorityLevel.MID, Department.HUMAN_RESOURCES)
        );   
        List<Role> rolesToSave = new ArrayList<>();

        for(RoleSeedData role: roleData) {
            Role newRole = new Role();
            newRole.setName(role.name());
            newRole.setSeniorityLevel(role.seniorityLevel());
            newRole.setDepartment(role.department());
            rolesToSave.add(newRole);
        }
        roleRepo.saveAllAndFlush(rolesToSave);
        return rolesToSave;
    };

    private List<Address> seedAddresses() { 
        if(addressRepo.count() > 0) {
            return addressRepo.findAll();
        }

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
        return List.of(address1, address2);
    }

    private void seedEmployees(List<Role> roles, List<Address> addresses) { 

        if (employeeRepo.count() > 0) {
            return;
        }

        Employee employee1 = new Employee();
        employee1.setFirstName("Sarah");
        employee1.setLastName("Jenkins");
        employee1.setMiddleName("Marie");
        employee1.setPronouns(Pronouns.SHE_HER);
        employee1.setPreferredName("SJ");
        employee1.setEmailAddress("sarah.jenkins@example.com");
        employee1.setPhoneNumber("+61412345678");
        employee1.setAddress(addresses.get(0));
        employee1.setRole(roles.get(0));
        employee1.setManager(null);
        employee1.setWorkSetup(WorkSetup.ON_SITE);
        employee1.setEmploymentType(EmploymentType.FULL_TIME_PERMANENT);
        employee1.setStartDate(LocalDate.of(2021, 3, 15));
        employee1.setLastDate(null);
        employee1.setIsCurrentlyEmployed(true);
        employeeRepo.saveAndFlush(employee1);

        Employee employee2 = new Employee();
        employee2.setFirstName("Alex");
        employee2.setLastName("Rivera");
        employee2.setMiddleName(null);
        employee2.setPreferredName("Al");
        employee2.setPronouns(Pronouns.HE_HIM);

        employee2.setEmailAddress("alex.rivera@example.com");
        employee2.setPhoneNumber("+61498765432");
        employee2.setAddress(addresses.get(1));
        employee2.setRole(roles.get(1));
        employee2.setManager(employee1);
        employee2.setWorkSetup(WorkSetup.HYBRID);
        employee2.setEmploymentType(EmploymentType.FULL_TIME_PERMANENT);
        employee2.setStartDate(LocalDate.of(2023, 8, 1));
        employee2.setLastDate(null);
        employee2.setIsCurrentlyEmployed(true);
        employeeRepo.saveAndFlush(employee2);
    }
}
