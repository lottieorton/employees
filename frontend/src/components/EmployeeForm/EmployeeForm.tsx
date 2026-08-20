import Button from "../Button/Button";
import CheckboxField from "../fields/CheckboxField/CheckboxField";
import InputField from "../fields/InputField/InputField";
import RadioGroupField from "../fields/RadioGroupField/RadioGroupField";
import SelectField from "../fields/SelectField/SelectField";

export default function EmployeeForm() {
  const employee = {
    id: "1",
    firstName: "Charlotte",
    preferredName: "Lottie",
    lastName: "Orton",
    emailAddress: "sarah.chen@mycompany.com",
    jobTitle: "Software Engineer",
    department: "Engineering",
    startDate: "2021-03-15",
    seniority: "Senior",
  };

  return (
    <>
      <button className="flex justify-start text-indigo-600 font-medium text-base hover:underline transition-colors cursor-pointer hover:text-indigo-800">
        ← Back to Team
      </button>
      <div className="flex flex-col align-middle gap-1">
        <h1 className="text-2xl text-zinc-950 font-bold text-center">{`${employee.firstName} ${employee.preferredName && `(${employee.preferredName})`} ${employee.lastName}`}</h1>
        <p className="text-sm text-zinc-600 text-center">{employee.jobTitle}</p>
      </div>

      <form className="grid grid-cols-2 gap-3 w-full ">
        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2">
          Personal Information
        </h3>
        <SelectField
          id="pronouns"
          label="Pronouns"
          colSpan="col-span-2 md:col-span-1"
          options={[
            { label: "he/him", value: "he/him" },
            { label: "she/her", value: "she/her" },
            { label: "they/them", value: "they/them" },
            { label: "Prefer not to say", value: "prefer_not_to_say" },
          ]}
          required
        />

        <InputField
          id="firstName"
          label="First Name"
          colSpan="col-span-1"
          required
        />
        <InputField id="middleName" label="Middle Name" colSpan="col-span-1" />
        <InputField
          id="lastName"
          label="Last Name"
          colSpan="col-span-1"
          required
        />
        <InputField
          id="preferredName"
          label="Preferred Name"
          colSpan="col-span-1"
        />
        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2">
          Contact Information
        </h3>
        <InputField
          id="emailAddress"
          label="Email Address"
          type="email"
          required
        />
        <InputField id="phoneNumber" label="Phone Number" type="tel" required />
        <InputField
          id="address"
          label="Residential Address"
          colSpan="col-span-2"
          required
        />

        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2">
          Employement Information
        </h3>
        <InputField
          id="role"
          label="Role"
          colSpan="col-span-2 md:col-span-1"
          required
        />
        <InputField
          id="department"
          label="Department"
          colSpan="col-span-2 md:col-span-1"
          required
        />
        <RadioGroupField
          id="workSetup"
          name="workSetup"
          label="Work Setup"
          options={[
            { label: "On-site", value: "onsite" },
            { label: "Hybrid", value: "hybrid" },
            { label: "Remote", value: "remote" },
          ]}
          required
        />
        <RadioGroupField
          id="employmentType"
          name="employmentType"
          label="Employment Type"
          options={[
            { label: "Full-time Permanent", value: "full_time" },
            { label: "Part-time Permanent", value: "part_time" },
            { label: "Contractor", value: "contractor" },
          ]}
          required
        />
        <InputField
          id="startDate"
          label="Start Date"
          colSpan="col-span-1"
          type="date"
        />
        <InputField
          id="endDate"
          label="End Date"
          colSpan="col-span-1"
          type="date"
        />
        <CheckboxField
          id="isActive"
          label="Currently Employed"
          colSpan="col-span-2"
        />
        <div className="col-span-full w-full flex flex-col gap-3 pt-6">
          <Button size="lg" type="primary">
            Save Changes
          </Button>
          <Button size="lg" type="danger">
            Delete employee
          </Button>
        </div>
      </form>
    </>
  );
}
