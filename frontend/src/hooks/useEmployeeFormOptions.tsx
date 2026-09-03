import { useEffect, useState } from "react";
import type { Role } from "../interfaces/Role";
import { useWatch, type Control } from "react-hook-form";
import type { FormValues } from "../schemas/employeeSchema";
import { getAllRoles } from "../services/roles-service";
import { useEmployees } from "./useEmployees";
import type { FormOption, FormOptions } from "../interfaces/formInterfaces";
import { getEmployeeFormEnums } from "../services/employees-service";
import type { Employee } from "../interfaces/Employee";

export function useEmployeeFormOptions(
  control: Control<FormValues>,
  currentEmployee: Employee | undefined,
) {
  // form enums state
  const [formOptions, setFormOptions] = useState<FormOptions>({
    pronouns: [],
    workSetup: [],
    employmentType: [],
  });
  const [isFormEnumsError, setIsFormEnumsError] = useState<boolean>(false);
  const [isFormEnumsLoading, setIsFormEnumsLoading] = useState<boolean>(false);

  // roles state
  const [roles, setRoles] = useState<Role[]>([]);
  const [isRolesLoading, setIsRolesLoading] = useState<boolean>(false);
  const [isRolesError, setIsRolesError] = useState<boolean>(false);

  const selectedRoleName = useWatch({ control, name: "roleName" });
  const selectedSeniority = useWatch({ control, name: "seniorityLevel" });
  const selectedDepartment = useWatch({ control, name: "department" });

  //employees
  const {
    data: employees = [],
    isFetching: isEmployeesFetching,
    isError: isEmployeesError,
  } = useEmployees();

  useEffect(() => {
    setIsRolesLoading(true);
    setIsRolesError(false);

    getAllRoles()
      .then(setRoles)
      .catch(() => setIsRolesError(true))
      .finally(() => setIsRolesLoading(false));
  }, []);

  useEffect(() => {
    setIsFormEnumsLoading(true);
    setIsFormEnumsError(false);
    getEmployeeFormEnums()
      .then((data: FormOptions) => {
        const enums = Object.fromEntries(
          Object.entries(data).map(([key, items]) => [
            key,
            items.map((item: FormOption) => ({
              ...item,
              value: item.label,
            })),
          ]),
        ) as FormOptions;
        setFormOptions(enums);
      })
      .catch(() => setIsFormEnumsError(true))
      .finally(() => setIsFormEnumsLoading(false));
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

  const managerOptions = employees
    .filter((e) => !currentEmployee || currentEmployee.id !== e.id)
    .map((e) => {
      return {
        value: e.id,
        label: `${e.firstName} ${e.lastName} (${e.role?.name})`,
      };
    });

  return {
    formOptions,
    managerOptions,
    getUniqueOptions,
    getSelectedRoleId,
    isLoading: isEmployeesFetching || isRolesLoading || isFormEnumsLoading,
    hasError: isEmployeesError || isRolesError || isFormEnumsError,
  };
}
