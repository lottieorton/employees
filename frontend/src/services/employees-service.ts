import { FetchError } from "../errors/errors";
import type { Employee } from "../interfaces/Employee";
import type { SearchQuery } from "../interfaces/SearchQuery";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllEmployees = async (
  searchQuery: SearchQuery,
): Promise<Employee[]> => {
  const queryString = Object.entries(searchQuery)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const resposne = await fetch(`${API_URL}/employees?${queryString}`);
  if (!resposne.ok) {
    throw new FetchError("Failed to fetch employees");
  }
  return resposne.json();
};
