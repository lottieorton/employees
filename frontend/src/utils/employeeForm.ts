import type { Employee } from "../interfaces/Employee";

export const mapDefaultValues = (e: Employee) => {
  return {
    pronouns: e.pronouns,
    firstName: e.firstName,
    lastName: e.lastName,
    workSetup: e.workSetup,
    middleName: e.middleName ?? "",
    preferredName: e.preferredName ?? "",
    emailAddress: e.emailAddress,
    phoneNumber: e.phoneNumber,
    unitNumber: e.address?.unitNumber ?? "",
    streetAddress: e.address?.streetAddress ?? "",
    addressLine2: e.address?.addressLine2 ?? "",
    city: e.address?.city ?? "",
    stateProvinceRegion: e.address?.stateProvinceRegion ?? "",
    postalCode: e.address?.postalCode ?? "",
    country: e.address?.country ?? "",
    roleName: e.role?.name ?? "",
    seniorityLevel: e.role?.seniorityLevel ?? "",
    department: e.role?.department ?? "",
    managerId: e.manager?.id.toString() ?? "",
    employmentType: e.employmentType,
    startDate: e.startDate,
    lastDate: e.lastDate ?? "",
    isCurrentlyEmployed: e.isCurrentlyEmployed ?? true,
  };
};
