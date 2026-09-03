import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { render, screen } from "@testing-library/react";
import * as employeesService from "../../services/employees-service";

describe("AppRoutes", () => {
  it("Should render the Homepage on home route", async () => {
    // arrange
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    // assert
    const createPageTitle = await screen.findByRole("heading", { level: 1 });
    expect(createPageTitle).toHaveTextContent("Team");
  });

  it("Should render the Create Employee page on /create route", async () => {
    // arrange
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/create"]}>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    // assert
    const createPageTitle = await screen.findByText(/create new employee/i);
    expect(createPageTitle).toBeInTheDocument();
  });

  it("Should render the Employee page on correct /{id} route", async () => {
    // arrange
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const mockEmployee = {
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
    vi.spyOn(employeesService, "getEmployeeById").mockResolvedValueOnce(
      mockEmployee,
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/1"]}>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    // act
    const employeeName = await screen.findByRole("heading", { level: 1 });
    // assert
    expect(employeeName).toHaveTextContent("Sarah (SJ) Jenkins");
    expect(employeesService.getEmployeeById).toHaveBeenCalledWith("1");
  });
});
