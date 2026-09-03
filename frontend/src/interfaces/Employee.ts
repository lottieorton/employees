import type { Role } from "./Role";
import type { Address } from "./Address";

export interface ManagerSummary {
  id: number;
  fullName: string;
  role: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  preferredName: string | null;
  pronouns: string;
  emailAddress: string;
  phoneNumber: string;
  address: Address | null;
  role: Role | null;
  manager: ManagerSummary | null;
  workSetup: string;
  employmentType: string;
  startDate: string;
  lastDate: string | null;
  isCurrentlyEmployed: boolean;
}
