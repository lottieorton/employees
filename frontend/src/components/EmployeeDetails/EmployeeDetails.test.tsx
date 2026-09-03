import { render, screen } from "@testing-library/react";
import EmployeeDetails from "./EmployeeDetails";

vi.mock("../fields/ViewOnlyField/ViewOnlyField", () => {
  return {
    default: ({ label, value }: { label: string; value: string }) => (
      <p>{`${label}: ${value} `}</p>
    ),
  };
});

describe("EmployeeDetails", () => {
  it("Should render with employee info passed to the View only fields", () => {
    // arrange
    const employee = {
      id: 1,
      firstName: "Sarah",
      lastName: "Jenkins",
      middleName: "Marie",
      preferredName: "SJ",
      pronouns: "She/Her",
      emailAddress: "sarah.jenkins@example.com",
      phoneNumber: "+61412345678",
      address: {
        id: 4,
        unitNumber: "30",
        streetAddress: "Park Lane",
        addressLine2: "Leicester Square",
        city: "London",
        stateProvinceRegion: "Mayfair",
        postalCode: "E1 1GB",
        country: "England",
      },
      role: {
        id: 1,
        name: "Software Developer",
        seniorityLevel: "Junior",
        department: "Engineering",
      },
      manager: null,
      workSetup: "Onsite",
      employmentType: "Full-Time Permanent",
      startDate: "2021-03-15",
      lastDate: null,
      isCurrentlyEmployed: true,
    };
    render(<EmployeeDetails employee={employee} />);
    // act
    const headers = screen.getAllByRole("heading", { level: 3 });
    const viewOnlyFields = screen.getAllByRole("paragraph");
    const expectedFields = [
      "Pronouns: She/Her",
      "First Name: Sarah",
      "Middle Name: Marie",
      "Last Name: Jenkins",
      "Preferred Name: SJ",
      "Email Address: sarah.jenkins@example.com",
      "Phone Number: +61412345678",
      "Unit Number: 30",
      "Street Address: Park Lane",
      "Address Line 2: Leicester Square",
      "City: London",
      "State/Province/Region: Mayfair",
      "Postal Code: E1 1GB",
      "Country: England",
      "Role Name: Software Developer",
      "Seniority: Junior",
      "Department: Engineering",
      "Manager: null",
      "Work Setup: Onsite",
      "Employment Type: Full-Time Permanent",
      "Start Date: 2021-03-15",
      "Last Date: null",
      "Current Employee: Yes",
    ];
    // assert
    expect(headers).toHaveLength(3);
    expect(headers[0]).toHaveTextContent("Personal Information");
    expect(headers[1]).toHaveTextContent("Contact Information");
    expect(headers[2]).toHaveTextContent("Employment Information");
    expect(viewOnlyFields).toHaveLength(23);
    expectedFields.forEach((expectedText, index) => {
      expect(viewOnlyFields[index]).toHaveTextContent(expectedText);
    });
  });

  it("Should render current employee as no when isCurrentlyEmployed is false", () => {
    // arrange
    const employee = {
      id: 1,
      firstName: "Sarah",
      lastName: "Jenkins",
      middleName: "Marie",
      preferredName: "SJ",
      pronouns: "She/Her",
      emailAddress: "sarah.jenkins@example.com",
      phoneNumber: "+61412345678",
      address: {
        id: 4,
        unitNumber: "30",
        streetAddress: "Park Lane",
        addressLine2: "Leicester Square",
        city: "London",
        stateProvinceRegion: "Mayfair",
        postalCode: "E1 1GB",
        country: "England",
      },
      role: {
        id: 1,
        name: "Software Developer",
        seniorityLevel: "Junior",
        department: "Engineering",
      },
      manager: null,
      workSetup: "Onsite",
      employmentType: "Full-Time Permanent",
      startDate: "2021-03-15",
      lastDate: null,
      isCurrentlyEmployed: false,
    };
    render(<EmployeeDetails employee={employee} />);
    // act
    const currentEmployee = screen.getByText("Current Employee: No");
    // assert
    expect(currentEmployee).toBeInTheDocument();
  });
});
