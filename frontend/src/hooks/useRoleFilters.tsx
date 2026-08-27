import { useEffect, useState } from "react";
import type { Role } from "../interfaces/Employee";
import { useWatch, type Control } from "react-hook-form";
import type { FormValues } from "../schemas/employeeSchema";
import { getAllRoles } from "../services/roles-service";

export function useRoleFilters(control: Control<FormValues>) {
  const [roles, setRoles] = useState<Role[]>([]);

  const selectedRoleName = useWatch({ control, name: "roleName" });
  const selectedSeniority = useWatch({ control, name: "seniorityLevel" });
  const selectedDepartment = useWatch({ control, name: "department" });

  useEffect(() => {
    getAllRoles()
      .then(setRoles)
      .catch(() => console.error("Issue fetching roles"));
  }, []);

  const getFilteredRolesExcluding = (excludeField?: keyof Role) => {
    if (!roles) return [];

    return roles.filter((role) => {
      const nameMatches =
        excludeField === "name" ||
        !selectedRoleName ||
        role.name === selectedRoleName;

      const seniorityMatches =
        excludeField === "seniorityLevel" ||
        !selectedSeniority ||
        role.seniorityLevel === selectedSeniority;

      const departmentMatches =
        excludeField === "department" ||
        !selectedDepartment ||
        role.department === selectedDepartment;

      return nameMatches && seniorityMatches && departmentMatches;
    });
  };

  const getUniqueOptions = (targetKey: keyof Role) => {
    const available = getFilteredRolesExcluding(targetKey);
    return [
      ...new Set(
        available
          .filter((r) => r[targetKey] != null)
          .map((r: Role) => r[targetKey]),
      ),
    ].map((value) => {
      return { label: String(value), value: String(value) };
    });
  };

  const getSelectedRoleId = (d: FormValues) => {
    return roles?.find(
      (r) =>
        r.name === d.roleName &&
        r.seniorityLevel === d.seniorityLevel &&
        r.department === d.department,
    )?.id;
  };

  return { getUniqueOptions, getSelectedRoleId };
}
