import { FetchError } from "../errors/errors";
import type { Address } from "../interfaces/Address";
import type { FormValues } from "../schemas/employeeSchema";

const API_URL = import.meta.env.VITE_API_URL;

export const createAddress = async (formData: FormValues): Promise<Address> => {
  const response = await fetch(`${API_URL}/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (response.status !== 201) {
    const errorResponseBody = await response.json().catch(() => null);
    throw new FetchError(
      errorResponseBody.message ?? "Failed to create address",
    );
  }
  return response.json();
};
