import { FetchError } from "../errors/errors";
import type { Role } from "../interfaces/Role";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const getAllRoles = async (): Promise<Role[]> => {
  const response = await fetch(`${API_URL}/roles`);
  if (!response.ok) {
    throw new FetchError("Failed to fetch roles");
  }
  return response.json();
};
