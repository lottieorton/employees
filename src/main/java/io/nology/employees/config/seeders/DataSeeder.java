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
            new RoleSeedData("HR Manager", SeniorityLevel.LEAD, Department.HUMAN_RESOURCES),
            new RoleSeedData("Junior Frontend Developer", SeniorityLevel.JUNIOR, Department.ENGINEERING),
            new RoleSeedData("HR Specialist", SeniorityLevel.MID, Department.HUMAN_RESOURCES),
            new RoleSeedData("QA Automation Engineer", SeniorityLevel.SENIOR, Department.QUALITY_ASSURANCE),
            new RoleSeedData("Associate Product Manager", SeniorityLevel.JUNIOR, Department.PRODUCT)
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
        Address address3 = new Address();
        address3.setStreetAddress("42 Wallaby Way");
        address3.setCity("Sydney");
        address3.setStateProvinceRegion("New South Wales");
        address3.setPostalCode("2000");
        address3.setCountry("Australia");
        addressRepo.saveAndFlush(address3);
        Address address4 = new Address();
        address4.setUnitNumber("Apt 4B");
        address4.setStreetAddress("742 Evergreen Terrace");
        address4.setAddressLine2("Building C");
        address4.setCity("Springfield");
        address4.setPostalCode("97477");
        address4.setCountry("United States");
        addressRepo.saveAndFlush(address4);
        Address address5 = new Address();
        address5.setUnitNumber("Suite 300");
        address5.setStreetAddress("101 Innovation Boulevard");
        address5.setCity("Melbourne");
        address5.setStateProvinceRegion("Victoria");
        address5.setPostalCode("3000");
        address5.setCountry("Australia");
        addressRepo.saveAndFlush(address5);
        return List.of(address1, address2, address3, address4, address5);
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
        employee1.setEmailAddress("sarah.jenkins@mycompany.com");
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
        employee2.setEmailAddress("alex.rivera@mycompany.com");
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

        Employee employee3 = new Employee();
        employee3.setFirstName("Liam");
        employee3.setLastName("O'Connor");
        employee3.setMiddleName("James");
        employee3.setPreferredName("Li");
        employee3.setPronouns(Pronouns.HE_THEY);
        employee3.setEmailAddress("liam.oconnor@mycompany.com");
        employee3.setPhoneNumber("+61433221144");
        employee3.setAddress(addresses.get(2));
        employee3.setRole(roles.get(2));
        employee3.setManager(employee1);
        employee3.setWorkSetup(WorkSetup.REMOTE);
        employee3.setEmploymentType(EmploymentType.CONTRACTOR);
        employee3.setStartDate(LocalDate.of(2024, 1, 10));
        employee3.setLastDate(null);
        employee3.setIsCurrentlyEmployed(true);
        employeeRepo.saveAndFlush(employee3);

        Employee employee4 = new Employee();
        employee4.setFirstName("Chloe");
        employee4.setLastName("Tan");
        employee4.setMiddleName(null);
        employee4.setPreferredName(null);
        employee4.setPronouns(Pronouns.SHE_HER);
        employee4.setEmailAddress("chloe.tan@mycompany.com");
        employee4.setPhoneNumber("+61455667788");
        employee4.setAddress(addresses.get(3));
        employee4.setRole(roles.get(3));
        employee4.setManager(null);
        employee4.setWorkSetup(WorkSetup.HYBRID);
        employee4.setEmploymentType(EmploymentType.PART_TIME_PERMANENT);
        employee4.setStartDate(LocalDate.of(2022, 5, 1));
        employee4.setLastDate(LocalDate.of(2025, 12, 31));
        employee4.setIsCurrentlyEmployed(false);
        employeeRepo.saveAndFlush(employee4);

        Employee employee5 = new Employee();
        employee5.setFirstName("Marcus");
        employee5.setLastName("Vance");
        employee5.setMiddleName("David");
        employee5.setPreferredName(null);
        employee5.setPronouns(Pronouns.HE_HIM);
        employee5.setEmailAddress("marcus.vance@mycompany.com");
        employee5.setPhoneNumber("+61488990011");
        employee5.setAddress(addresses.get(4));
        employee5.setRole(roles.get(4));
        employee5.setManager(employee2);
        employee5.setWorkSetup(WorkSetup.ON_SITE);
        employee5.setEmploymentType(EmploymentType.FULL_TIME_PERMANENT);
        employee5.setStartDate(LocalDate.of(2025, 2, 20));
        employee5.setLastDate(null);
        employee5.setIsCurrentlyEmployed(true);
        employeeRepo.saveAndFlush(employee5);
    }
}
