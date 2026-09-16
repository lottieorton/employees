package io.nology.employees.config.seeders;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.github.javafaker.Faker;

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
        // List<Address> addresses = seedAddresses();
        // seedEmployees(roles, addresses);
        seedEmployees(roles);
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

    private void seedEmployees(List<Role> roles) { 
        if (employeeRepo.count() > 0) {
            return;
        }

        Faker faker = new Faker();
        Address address1 = createAndSaveAddress(faker.address().streetAddressNumber(), faker.address().streetAddress(), faker.address().city(), faker.address().stateAbbr(), faker.address().zipCode());
        Address address2 = createAndSaveAddress(faker.address().streetAddressNumber(), faker.address().streetAddress(), faker.address().city(), faker.address().stateAbbr(), faker.address().zipCode());

        Employee employee1 = createEmployee(
            "Sarah",
            "Jenkins",
            "Marie",
            Pronouns.SHE_HER,
            "SJ",
            "sarah.jenkins@mycompany.com",
            "+61412345678",
            address1,
            roles.get(0),
            null,
            WorkSetup.ON_SITE,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2021, 3, 15),
            null,
            true
        );
        employeeRepo.saveAndFlush(employee1);

        Employee employee2 = createEmployee(
            "Alex",
            "Rivera",
            null,
            Pronouns.HE_HIM,
            "Al",
            "alex.rivera@mycompany.com",
            "+61498765432",
            address2,
            roles.get(1),
            employee1,
            WorkSetup.HYBRID,
            EmploymentType.FULL_TIME_PERMANENT,
            LocalDate.of(2023, 8, 1),
            null,
            true
        );
        employeeRepo.saveAndFlush(employee2);

        List<Employee> employeesSaved = new ArrayList<>();
        employeesSaved.add(employee1);
        employeesSaved.add(employee2);

        Pronouns[] pronouns = Pronouns.values();
        WorkSetup[] workSetup = WorkSetup.values();
        EmploymentType[] employmentType = EmploymentType.values();
        
        for (int i = 0; i < 20; i++) {
            Address a = createAndSaveAddress(faker.address().streetAddressNumber(), faker.address().streetAddress(), faker.address().city(), faker.address().stateAbbr(), faker.address().zipCode());
            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();
            String emailAddress = createUniqueEmail(firstName, lastName);
            int managerIndex = ThreadLocalRandom.current().nextInt(employeesSaved.size() + 3);
            Employee manager = managerIndex >= employeesSaved.size() ? null : employeesSaved.get(managerIndex);
            Employee e = createEmployee(
                firstName, 
                lastName, 
                faker.name().firstName(), 
                pronouns[(int) (Math.random() * pronouns.length)], 
                null, 
                emailAddress, 
                faker.phoneNumber().phoneNumber(), 
                a, 
                roles.get(ThreadLocalRandom.current().nextInt(roles.size())),
                manager, 
                workSetup[(int) (Math.random() * workSetup.length)], 
                employmentType[(int) (Math.random() * employmentType.length)], 
                faker.date().past(1000, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate(), 
                null, 
                true);
            this.employeeRepo.saveAndFlush(e);
            employeesSaved.add(e);
        }

    }

    private Address createAndSaveAddress(String unit, String street, String city, String state, String postCode) {
        Address address = new Address();
        address.setUnitNumber(unit);
        address.setStreetAddress(street);
        address.setAddressLine2("Suburb");
        address.setCity(city);
        address.setStateProvinceRegion(state);
        address.setCountry("Aus");
        address.setPostalCode(postCode);
        this.addressRepo.saveAndFlush(address);
        return address;
    }

    private Employee createEmployee(String firstName, String lastName, String middleName, Pronouns pronouns, String preferredName, String emailAddress, String phoneNumber, Address address, Role role, Employee manager, WorkSetup workSetup, EmploymentType employmentType, LocalDate startDate, LocalDate lastDate, Boolean isCurrentlyEmployed) {
        Employee employee = new Employee();
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setMiddleName(middleName);
        employee.setPronouns(pronouns);
        employee.setPreferredName(preferredName);
        employee.setEmailAddress(emailAddress);
        employee.setPhoneNumber(phoneNumber);
        employee.setAddress(address);
        employee.setRole(role);
        employee.setManager(manager);
        employee.setWorkSetup(workSetup);
        employee.setEmploymentType(employmentType);
        employee.setStartDate(startDate);
        employee.setLastDate(lastDate);
        employee.setIsCurrentlyEmployed(isCurrentlyEmployed);
        return employee;
    }

    private String createUniqueEmail(String firstName, String lastName) {
        String cleanFirst = firstName.toLowerCase().replaceAll("[^a-z0-9]", "");
        String cleanLast = lastName.toLowerCase().replaceAll("[^a-z0-9]", "");

        String candidateEmail = String.format("%s.%s@mycompany.com", cleanFirst, cleanLast);
        int counter = 1;

        while(this.employeeRepo.existsByEmailAddress(candidateEmail)) {
            candidateEmail = String.format("%s.%s%s@mycompany.com", cleanFirst, cleanLast, counter);
            counter++;
        }

        return candidateEmail;
    }

}
