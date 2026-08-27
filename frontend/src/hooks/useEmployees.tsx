import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Employee } from "../interfaces/Employee";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
} from "../services/employees-service";
import type { SearchQuery } from "../interfaces/SearchQuery";
import type { FormValues } from "../schemas/employeeSchema";

export const EMPLOYEES_KEY = "employees";

export function useEmployees(searchQuery?: SearchQuery) {
  return useQuery<Employee[]>({
    queryKey: [EMPLOYEES_KEY, searchQuery],
    queryFn: () => getAllEmployees(searchQuery),
  });
}

export function useEmployee(id?: string) {
  return useQuery<Employee>({
    queryKey: [EMPLOYEES_KEY, id],
    queryFn: () => getEmployeeById(id),
    enabled: Boolean(id),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation<Employee, Error, FormValues>({
    mutationFn: (formData) => createEmployee(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
}
