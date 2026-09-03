import { employeeSchema } from "./employeeSchema";

describe("employeeSchema", () => {
  const validEmployeeData = {
    pronouns: "She/Her",
    firstName: "Sarah",
    middleName: "Marie",
    lastName: "Jenkins",
    preferredName: "SJ",
    emailAddress: "sarah.jenkins@example.com",
    phoneNumber: "+61412345678",
    unitNumber: "30",
    streetAddress: "Park Lane",
    addressLine2: "Suite 4",
    city: "Sydney",
    stateProvinceRegion: "NSW",
    postalCode: "2000",
    country: "Australia",
    roleName: "Software Developer",
    seniorityLevel: "Junior",
    department: "Engineering",
    managerId: "1",
    workSetup: "Onsite",
    employmentType: "Full-Time Permanent",
    startDate: "2024-01-15",
    lastDate: null,
    isCurrentlyEmployed: true,
  };

  it("Should successfully parse and transform a valid employee object", () => {
    const result = employeeSchema.safeParse(validEmployeeData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.startDate).toBe("2024-01-15");
    }
  });

  it("Should fail if required fields are missing or empty", () => {
    const invalidData = {
      ...validEmployeeData,
      firstName: "",
      pronouns: "",
    };
    const result = employeeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(2);
      const pronounIssue = result.error.issues.find((issue) =>
        issue.path.includes("pronouns"),
      );
      const firstNameIssue = result.error.issues.find((issue) =>
        issue.path.includes("firstName"),
      );
      expect(pronounIssue?.message).toBe("Must select pronoun choice");
      expect(firstNameIssue?.message).toBe("First name cannot be empty");
    }
  });

  it("Should validate phone number constraints", () => {
    const invalidData = {
      ...validEmployeeData,
      phoneNumber: "0123456789101213141516",
    };
    const result = employeeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const phoneNumIssue = result.error.issues.find((issue) =>
        issue.path.includes("phoneNumber"),
      );
      expect(phoneNumIssue?.message).toBe(
        "Phone number must be between 7 and 20 characters",
      );
    }
  });

  it("Should transform empty or whitespace-only optional strings to null", () => {
    const dataWithEmptyOptionals = {
      ...validEmployeeData,
      middleName: "   ",
      addressLine2: "",
    };

    const result = employeeSchema.safeParse(dataWithEmptyOptionals);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.middleName).toBeNull();
      expect(result.data.addressLine2).toBeNull();
    }
  });

  it("Should transform valid lastDate strings into formatted date", () => {
    const dataWithDate = {
      ...validEmployeeData,
      lastDate: "2025-12-31T00:00:00.000Z",
    };

    const result = employeeSchema.safeParse(dataWithDate);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lastDate).toBe("2025-12-31");
    }
  });

  it("Should fail if lastDate is before startDate", () => {
    const invalidDates = {
      ...validEmployeeData,
      startDate: "2024-06-01",
      lastDate: "2024-01-01",
    };

    const result = employeeSchema.safeParse(invalidDates);

    expect(result.success).toBe(false);
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message);
      expect(errorMessages).toContain("Last date must be after start date");
    }
  });
});
