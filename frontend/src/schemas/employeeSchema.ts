import { z } from "zod";

export const SeniorityLevelEnum = z.enum([
  "JUNIOR",
  "MID",
  "SENIOR",
  "LEAD",
  "PRINCIPAL",
]);
export const DepartmentEnum = z.enum([
  "Engineering",
  "Quality Assurance",
  "Design",
  "Product",
  "Human Resources",
]);

const optionalString = z
  .string()
  .transform((val) => {
    const trimmed = val.trim();
    return trimmed === "" ? null : trimmed;
  })
  .nullable()
  .optional();

export const employeeSchema = z
  .object({
    pronouns: z.string().min(1, { message: "Must select pronoun choice" }),
    firstName: z
      .string()
      .trim()
      .min(1, { message: "First name cannot be empty" }),
    middleName: optionalString,
    lastName: z
      .string()
      .trim()
      .min(1, { message: "Last name cannot be empty" }),
    preferredName: optionalString,
    emailAddress: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z
      .string()
      .trim()
      .min(7, { message: "Phone number must be between 7 and 20 characters" })
      .max(20, "Phone number must be between 7 and 20 characters"),
    unitNumber: z
      .string()
      .trim()
      .min(1, { message: "Unit Number cannot be empty" }),
    streetAddress: z
      .string()
      .trim()
      .min(1, { message: "Street Address cannot be empty" }),
    addressLine2: optionalString,
    city: z.string().trim().min(1, { message: "City cannot be empty" }),
    stateProvinceRegion: optionalString,
    postalCode: z
      .string()
      .trim()
      .min(1, { message: "Postal Code cannot be empty" }),
    country: z.string().trim().min(1, { message: "Country cannot be empty" }),
    roleName: z
      .string()
      .trim()
      .min(1, { message: "Role name cannot be empty" }),
    seniorityLevel: SeniorityLevelEnum,
    department: DepartmentEnum,
    manager: z.string().nullable().optional(),
    workSetup: z
      .string({ message: "Must select work setup" })
      .min(1, { message: "Work setup cannot be empty" }),
    employmentType: z
      .string({ message: "Must select employment type" })
      .min(1, { message: "Employment type cannot be empty" }),
    startDate: z.string().min(1, "Start date is required"),
    lastDate: optionalString,
    isCurrentlyEmployed: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.lastDate || !data.startDate) return true;
      return new Date(data.lastDate) > new Date(data.startDate);
    },
    {
      message: "Last date must be after start date",
      path: ["lastDate"],
    },
  );

export type FormValues = z.infer<typeof employeeSchema>;
