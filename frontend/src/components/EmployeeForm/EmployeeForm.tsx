import Button from "../Button/Button";
import CheckboxField from "../fields/CheckboxField/CheckboxField";
import InputField from "../fields/InputField/InputField";
import RadioGroupField from "../fields/RadioGroupField/RadioGroupField";
import SelectField from "../fields/SelectField/SelectField";

export default function EmployeeForm() {
  return (
    <section className="w-full flex flex-col gap-5">
      <form className="grid grid-cols-2 gap-3 w-full ">
        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2 3xl:text-2xl">
          Personal Information
        </h3>
        <SelectField
          id="pronouns"
          label="Pronouns"
          colSpan="col-span-2"
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
        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2 3xl:text-2xl">
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
          id="unitAddress"
          label="Unit Address"
          colSpan="col-span-1"
          required
        />
        <InputField
          id="streetAddress"
          label="Street Address"
          colSpan="col-span-1"
          required
        />
        <InputField
          id="addressLine2"
          label="Address Line 2"
          colSpan="col-span-1"
        />
        <InputField id="city" label="City" colSpan="col-span-1" required />
        <InputField
          id="stateProvinceRegion"
          label="State/Province/Region"
          colSpan="col-span-1"
        />
        <InputField
          id="postalCode"
          label="Postal Code"
          colSpan="col-span-1"
          required
        />
        <InputField
          id="country"
          label="Country"
          colSpan="col-span-1"
          required
        />

        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2 3xl:text-2xl">
          Employement Information
        </h3>
        <SelectField
          id="role"
          label="Role"
          colSpan="col-span-2 md:col-span-1"
          options={[
            { label: "Software Developer", value: "Software Developer" },
            { label: "QA / Test Engineer", value: "QA / Test Engineer" },
            { label: "DevOps Engineer", value: "DevOps Engineer" },
            { label: "Engineering Manager", value: "Engineering Manager" },
          ]}
          required
        />
        <SelectField
          id="seniorityLevel"
          label="Seniority"
          colSpan="col-span-2 md:col-span-1"
          options={[
            { label: "Junior", value: "Junior" },
            { label: "Mid", value: "Mid" },
            { label: "Senior", value: "Senior" },
            { label: "Lead", value: "Lead" },
          ]}
          required
        />
        <SelectField
          id="department"
          label="Department"
          colSpan="col-span-2 md:col-span-1"
          options={[
            { label: "Engineering", value: "Engineering" },
            { label: "Quality_Assurance", value: "Quality_Assurance" },
            { label: "DESIGN", value: "DESIGN" },
            { label: "PRODUCT", value: "PRODUCT" },
          ]}
          required
        />
        <InputField
          id="manager"
          label="Manager"
          colSpan="col-span-2 md:col-span-1"
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
          required
        />
        <InputField
          id="lastDate"
          label="Last Date"
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
    </section>
  );
}
