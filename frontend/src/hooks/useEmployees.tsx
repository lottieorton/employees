import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { Employee } from "../interfaces/Employee";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "../services/employees-service";
import type { SearchQuery } from "../interfaces/SearchQuery";
import type { FormValues } from "../schemas/employeeSchema";
import { deleteAddress } from "../services/addresses-service";

export const EMPLOYEES_KEY = "employees";

export function useEmployees(searchQuery?: SearchQuery) {
  return useQuery<Employee[]>({
    queryKey: [EMPLOYEES_KEY, searchQuery],
    queryFn: () => getAllEmployees(searchQuery),
  });
}

export function useEmployee(
  id?: string,
  options?: Omit<UseQueryOptions<Employee>, "queryKey" | "queryFn">,
) {
  return useQuery<Employee>({
    queryKey: [EMPLOYEES_KEY, id],
    queryFn: () => getEmployeeById(id),
    enabled: Boolean(id),
    ...options,
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

interface UpdateEmployeePayload {
  id: number;
  formData: FormValues;
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation<Employee, Error, UpdateEmployeePayload>({
    mutationFn: ({ id, formData }) => updateEmployee(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
}

interface DeleteEmployeePayload {
  id: number;
  addressId?: number;
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, DeleteEmployeePayload>({
    mutationFn: async ({ id, addressId }) => {
      const result = await deleteEmployee(id);
      if (addressId) {
        await deleteAddress(addressId);
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.removeQueries({
        queryKey: [EMPLOYEES_KEY, String(variables.id)],
      });
      queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] });
    },
  });
}
