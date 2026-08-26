export interface AddressSummary {
  id: number;
  formattedAddress: string;
}

export interface Role {
  id: number;
  name: string;
  seniorityLevel: string;
  department: string;
}

export interface ManagerSummary {
  id: number;
  fullName: string;
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
  address: AddressSummary | null;
  role: Role | null;
  manager: ManagerSummary | null;
  workSetup: string;
  employmentType: string;
  startDate: string;
  lastDate: string | null;
  isCurrentlyEmployed: boolean;
}
