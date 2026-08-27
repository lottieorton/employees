import { useForm, type SubmitHandler } from "react-hook-form";
import Button from "../Button/Button";
import CheckboxField from "../fields/CheckboxField/CheckboxField";
import InputField from "../fields/InputField/InputField";
import RadioGroupField from "../fields/RadioGroupField/RadioGroupField";
import SelectField from "../fields/SelectField/SelectField";
import { employeeSchema, type FormValues } from "../../schemas/employeeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { getEmployeeFormEnums } from "../../services/employees-service";

interface EmployeeFormProps {
  handlePageSubmit: () => void;
  handleWarningClick: () => void;
  submitBtnText: string;
  warningBtnText: string;
}

export interface FormOption {
  label: string;
  value: string;
}

interface FormOptions {
  pronouns: FormOption[];
  workSetup: FormOption[];
  employmentType: FormOption[];
}

export default function EmployeeForm({
  handlePageSubmit,
  handleWarningClick,
  submitBtnText,
  warningBtnText,
}: EmployeeFormProps) {
  const [formOptions, setFormOptions] = useState<FormOptions>({
    pronouns: [],
    workSetup: [],
    employmentType: [],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      isCurrentlyEmployed: true,
    },
  });

  useEffect(() => {
    getEmployeeFormEnums()
      .then(setFormOptions)
      .catch(() => console.log("Issue with fetching enums"));
  }, []);

  const onSubmit: SubmitHandler<FormValues> = (d): void => {
    console.log(d);
    handlePageSubmit();
  };

  return (
    <section className="w-full flex flex-col gap-5">
      <form
        className="grid grid-cols-2 gap-3 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2 3xl:text-2xl">
          Personal Information
        </h3>
        <SelectField
          id="pronouns"
          label="Pronouns"
          colSpan="col-span-2"
          options={formOptions.pronouns}
          required
          registration={register("pronouns")}
          error={errors.pronouns?.message}
        />

        <InputField
          id="firstName"
          label="First Name"
          colSpan="col-span-1"
          required
          registration={register("firstName")}
          error={errors.firstName?.message}
        />
        <InputField
          id="middleName"
          label="Middle Name"
          colSpan="col-span-1"
          registration={register("middleName")}
          error={errors.middleName?.message}
        />
        <InputField
          id="lastName"
          label="Last Name"
          colSpan="col-span-1"
          required
          registration={register("lastName")}
          error={errors.lastName?.message}
        />
        <InputField
          id="preferredName"
          label="Preferred Name"
          colSpan="col-span-1"
          registration={register("preferredName")}
          error={errors.preferredName?.message}
        />
        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2 3xl:text-2xl">
          Contact Information
        </h3>
        <InputField
          id="emailAddress"
          label="Email Address"
          type="email"
          required
          registration={register("emailAddress")}
          error={errors.emailAddress?.message}
        />
        <InputField
          id="phoneNumber"
          label="Phone Number"
          type="tel"
          required
          registration={register("phoneNumber")}
          error={errors.phoneNumber?.message}
        />
        <InputField
          id="unitNumber"
          label="Unit Number"
          colSpan="col-span-1"
          required
          registration={register("unitNumber")}
          error={errors.unitNumber?.message}
        />
        <InputField
          id="streetAddress"
          label="Street Address"
          colSpan="col-span-1"
          required
          registration={register("streetAddress")}
          error={errors.streetAddress?.message}
        />
        <InputField
          id="addressLine2"
          label="Address Line 2"
          colSpan="col-span-1"
          registration={register("addressLine2")}
          error={errors.addressLine2?.message}
        />
        <InputField
          id="city"
          label="City"
          colSpan="col-span-1"
          required
          registration={register("city")}
          error={errors.city?.message}
        />
        <InputField
          id="stateProvinceRegion"
          label="State/Province/Region"
          colSpan="col-span-1"
          registration={register("stateProvinceRegion")}
          error={errors.stateProvinceRegion?.message}
        />
        <InputField
          id="postalCode"
          label="Postal Code"
          colSpan="col-span-1"
          required
          registration={register("postalCode")}
          error={errors.postalCode?.message}
        />
        <InputField
          id="country"
          label="Country"
          colSpan="col-span-1"
          required
          registration={register("country")}
          error={errors.country?.message}
        />

        <h3 className="text-base text-zinc-950 font-semibold col-span-full pt-6 pb-2 3xl:text-2xl">
          Employement Information
        </h3>
        <SelectField
          id="roleName"
          label="Role Name"
          colSpan="col-span-2 md:col-span-1"
          options={[
            { label: "Software Developer", value: "Software Developer" },
          ]}
          required
          registration={register("roleName")}
          error={errors.roleName?.message}
        />
        <SelectField
          id="seniorityLevel"
          label="Seniority"
          colSpan="col-span-2 md:col-span-1"
          options={[{ label: "Junior", value: "JUNIOR" }]}
          required
          registration={register("seniorityLevel")}
          error={errors.seniorityLevel?.message}
        />
        <SelectField
          id="department"
          label="Department"
          colSpan="col-span-2 md:col-span-1"
          options={[{ label: "Engineering", value: "Engineering" }]}
          required
          registration={register("department")}
          error={errors.department?.message}
        />
        <SelectField
          id="manager"
          label="Manager"
          colSpan="col-span-2 md:col-span-1"
          options={[
            { label: "Manager One", value: "Manager One" },
            { label: "Manager Two", value: "ManagerTwo" },
          ]}
          registration={register("manager")}
          error={errors.manager?.message}
        />
        <RadioGroupField
          id="workSetup"
          name="workSetup"
          label="Work Setup"
          options={formOptions.workSetup}
          required
          registration={register("workSetup")}
          error={errors.workSetup?.message}
        />
        <RadioGroupField
          id="employmentType"
          name="employmentType"
          label="Employment Type"
          options={formOptions.employmentType}
          required
          registration={register("employmentType")}
          error={errors.employmentType?.message}
        />
        <InputField
          id="startDate"
          label="Start Date"
          colSpan="col-span-1"
          type="date"
          required
          registration={register("startDate")}
          error={errors.startDate?.message}
        />
        <InputField
          id="lastDate"
          label="Last Date"
          colSpan="col-span-1"
          type="date"
          registration={register("lastDate")}
          error={errors.lastDate?.message}
        />
        <CheckboxField
          id="isCurrentlyEmployed"
          label="Currently Employed"
          colSpan="col-span-2"
          registration={register("isCurrentlyEmployed")}
          error={errors.isCurrentlyEmployed?.message}
        />
        <div className="col-span-full w-full flex flex-col gap-3 pt-6">
          <Button size="lg" type="primary">
            {submitBtnText}
          </Button>
          <Button size="lg" type="danger" handleClick={handleWarningClick}>
            {warningBtnText}
          </Button>
        </div>
      </form>
    </section>
  );
}
