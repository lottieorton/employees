package io.nology.employees.config.seeders;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import io.nology.employees.role.RoleRepository;
import io.nology.employees.role.entities.Role;
import io.nology.employees.role.entities.SeniorityLevel;

@Component
@Profile({"dev"})
public class DataSeeder implements CommandLineRunner {
    private final RoleRepository roleRepo;

    public DataSeeder(RoleRepository roleRepo) {
        this.roleRepo = roleRepo;
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
    }
}
