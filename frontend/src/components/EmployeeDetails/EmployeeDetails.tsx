import type { Employee } from "../../interfaces/Employee";
import ViewOnlyField from "../fields/ViewOnlyField/ViewOnlyField";

interface EmployeeDetailsProps {
  employee: Employee;
}

export default function EmployeeDetails({ employee }: EmployeeDetailsProps) {
  return (
    <article className="w-full flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 w-full">
        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2 3xl:text-2xl">
          Personal Information
        </h3>

        <ViewOnlyField
          label="Pronouns"
          value={employee.pronouns}
          colSpan="col-span-2"
        />
        <ViewOnlyField label="First Name" value={employee.firstName} />
        <ViewOnlyField label="Middle Name" value={employee.middleName} />
        <ViewOnlyField label="Last Name" value={employee.lastName} />
        <ViewOnlyField label="Preferred Name" value={employee.preferredName} />

        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2 3xl:text-2xl">
          Contact Information
        </h3>
        <ViewOnlyField label="Email Address" value={employee.emailAddress} />
        <ViewOnlyField label="Phone Number" value={employee.phoneNumber} />
        <ViewOnlyField
          label="Unit Number"
          value={employee.address?.unitNumber}
        />
        <ViewOnlyField
          label="Street Address"
          value={employee.address?.streetAddress}
        />
        <ViewOnlyField
          label="Address Line 2"
          value={employee.address?.addressLine2}
        />
        <ViewOnlyField label="City" value={employee.address?.city} />
        <ViewOnlyField
          label="State/Province/Region"
          value={employee.address?.stateProvinceRegion}
        />
        <ViewOnlyField
          label="Postal Code"
          value={employee.address?.postalCode}
        />
        <ViewOnlyField label="Country" value={employee.address?.country} />
        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2 3xl:text-2xl">
          Employement Information
        </h3>
        <ViewOnlyField label="Role Name" value={employee.role?.name} />
        <ViewOnlyField
          label="Seniority"
          value={employee.role?.seniorityLevel}
        />
        <ViewOnlyField label="Department" value={employee.role?.department} />
        <ViewOnlyField
          label="Manager"
          value={
            employee.manager &&
            `${employee.manager?.fullName} (${employee.manager?.role})`
          }
        />
        <ViewOnlyField label="Work Setup" value={employee.workSetup} />
        <ViewOnlyField
          label="Employment Type"
          value={employee.employmentType}
        />
        <ViewOnlyField label="Start Date" value={employee.startDate} />
        <ViewOnlyField label="Last Date" value={employee.lastDate} />
        <ViewOnlyField
          label="Current Employee"
          value={employee.isCurrentlyEmployed ? "Yes" : "No"}
        />
      </div>
    </article>
  );
}
