import type { FormValues } from "../schemas/employeeSchema";
import type { Employee } from "./Employee";

export interface EmployeeFormProps {
  handlePageSubmit: (
    formData: FormValues,
    id?: number,
    addressId?: number,
  ) => void;
  handleWarningClick: (id?: number, addressId?: number) => void;
  submitBtnText: string;
  warningBtnText: string;
  hasEmail?: boolean;
  employee?: Employee;
}

export interface FormOption {
  label: string;
  value: string | number;
}

export interface FormOptions {
  pronouns: FormOption[];
  workSetup: FormOption[];
  employmentType: FormOption[];
}
