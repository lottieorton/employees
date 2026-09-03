import { render, screen } from "@testing-library/react";
import type { Employee } from "../../interfaces/Employee";
import EmployeeList from "./EmployeeList";

vi.mock("../EmployeeCard/EmployeeCard", () => ({
  default: ({ employee, bgColor }: { employee: Employee; bgColor: string }) => {
    return (
      <article
        aria-label={bgColor}
      >{`${employee.id} ${employee.firstName}`}</article>
    );
  },
}));

describe("EmployeeList", () => {
  const employees = [
    {
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
    },
    {
      id: 2,
      firstName: "Alex",
      lastName: "Rivera",
      middleName: null,
      preferredName: "Al",
      pronouns: "He/Him",
      emailAddress: "alex.rivera@example.com",
      phoneNumber: "+61498765432",
      address: {
        id: 5,
        unitNumber: "86",
        streetAddress: "Wallaby Way",
        addressLine2: "Opera House View Parade",
        city: "Sydney",
        stateProvinceRegion: "Darling Harbour",
        postalCode: "2000",
        country: "Australia",
      },
      role: {
        id: 2,
        name: "Software Developer",
        seniorityLevel: "Mid",
        department: "Engineering",
      },
      manager: {
        id: 4,
        fullName: "Sarah Jenkins",
        role: "Software Developer",
      },
      workSetup: "Hybrid",
      employmentType: "Full-Time Permanent",
      startDate: "2023-08-01",
      lastDate: null,
      isCurrentlyEmployed: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render a list of employee cards when a list of employees is provided", () => {
    // arrange
    render(
      <EmployeeList
        searchTerm=""
        employees={employees}
        isLoading={false}
        isError={false}
      />,
    );
    // act
    const employeeCards = screen.getAllByRole("article");
    // assert
    expect(employeeCards).toHaveLength(2);
    expect(employeeCards[0]).toHaveTextContent("1 Sarah");
    expect(employeeCards[0]).toHaveAccessibleName("bg-white");
    expect(employeeCards[1]).toHaveTextContent("2 Alex");
    expect(employeeCards[1]).toHaveAccessibleName("bg-gray-50");
  });

  it("Should render an custom error message when no employees are returned for no search query", () => {
    // arrange
    render(
      <EmployeeList
        searchTerm=""
        employees={[]}
        isLoading={false}
        isError={false}
      />,
    );
    // act
    const errorMsg = screen.getByText(
      "No employees exist. Begin creating some now.",
    );
    // assert
    expect(errorMsg).toBeInTheDocument();
  });

  it("Should render an custom error message when no employees are returned for a provided search query", () => {
    // arrange
    render(
      <EmployeeList
        searchTerm="susan"
        employees={[]}
        isLoading={false}
        isError={false}
      />,
    );
    // act
    const errorMsg = screen.getByText(
      "Oops there are no employees for this search. Please update it.",
    );
    // assert
    expect(errorMsg).toBeInTheDocument();
  });

  it("Should render an error message when there is an error with fetching employees", () => {
    // arrange
    render(
      <EmployeeList
        searchTerm=""
        employees={[]}
        isLoading={false}
        isError={true}
      />,
    );
    // act
    const errorMsg = screen.getByText(
      "Failed to load employees. Please try refreshing the page.",
    );
    // assert
    expect(errorMsg).toBeInTheDocument();
  });

  it("Should render a loading message when fetching employees isLoading", () => {
    // arrange
    render(
      <EmployeeList
        searchTerm=""
        employees={[]}
        isLoading={true}
        isError={false}
      />,
    );
    // act
    const loadingMsg = screen.getByText("Loading employees...");
    // assert
    expect(loadingMsg).toBeInTheDocument();
  });
});
