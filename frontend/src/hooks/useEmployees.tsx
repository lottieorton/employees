import { useQuery } from "@tanstack/react-query";
import type { Employee } from "../interfaces/Employee";
import {
  getAllEmployees,
  getEmployeeById,
} from "../services/employees-service";
import type { SearchQuery } from "../interfaces/SearchQuery";

export const EMPLOYEES_KEY = "employees";

export function useEmployees(searchQuery: SearchQuery) {
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
