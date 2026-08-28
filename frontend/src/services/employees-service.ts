import { FetchError } from "../errors/errors";
import type { Employee } from "../interfaces/Employee";
import type { SearchQuery } from "../interfaces/SearchQuery";
import type { FormValues } from "../schemas/employeeSchema";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllEmployees = async (
  searchQuery?: SearchQuery,
): Promise<Employee[]> => {
  let queryString = "";
  if (searchQuery) {
    queryString +=
      "?" +
      Object.entries(searchQuery)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
  }
  const response = await fetch(`${API_URL}/employees${queryString}`);
  if (!response.ok) {
    throw new FetchError("Failed to fetch employees");
  }
  return response.json();
};

export const getEmployeeById = async (id?: string): Promise<Employee> => {
  if (!id) {
    throw new FetchError("Invalid employee ID");
  }
  const response = await fetch(`${API_URL}/employees/${id}`);
  if (!response.ok) {
    throw new FetchError("Failed to fetch employee");
  }
  return response.json();
};

export const createEmployee = async (
  formData: FormValues,
): Promise<Employee> => {
  const response = await fetch(`${API_URL}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (response.status !== 201) {
    const errorResponseBody = await response.json().catch(() => null);
    throw new FetchError(
      errorResponseBody.message ?? "Failed to create employee",
    );
  }
  return response.json();
};

export const updateEmployee = async (
  id: number,
  formData: FormValues,
): Promise<Employee> => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorResponseBody = await response.json().catch(() => null);
    throw new FetchError(
      errorResponseBody.message ?? "Failed to update employee",
    );
  }
  return response.json();
};

export const deleteEmployee = async (id: number): Promise<boolean> => {
  const response = await fetch(`${API_URL}/employees/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorResponseBody = await response.json().catch(() => null);
    throw new FetchError(
      errorResponseBody.message ?? "Failed to delete employee",
    );
  }
  return true;
};

export const getEmployeeFormEnums = async () => {
  const response = await fetch(`${API_URL}/employees/enums`);
  if (!response.ok) {
    throw new FetchError("Failed for fetch form enums");
  }
  return response.json();
};
