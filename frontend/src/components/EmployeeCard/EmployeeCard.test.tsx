import { render, screen } from "@testing-library/react";
import EmployeeCard from "./EmployeeCard";
import { useDeleteEmployee } from "../../hooks/useEmployees";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../../hooks/useEmployees", () => ({
  useDeleteEmployee: vi.fn(),
}));

describe("Employee Card", () => {
  const mockMutate = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useDeleteEmployee).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

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

  it("Should render card with employee details and link pointing to employee page", () => {
    // arrange
    render(
      <MemoryRouter>
        <EmployeeCard employee={employee} bgColor="bg-white" />
      </MemoryRouter>,
    );
    // act
    const card = screen.getByRole("article");
    const heading = screen.getByRole("heading", { level: 3 });
    const employeeInfo = screen.getAllByRole("paragraph");
    const viewLink = screen.getByRole("link");
    const deleteBtn = screen.getByRole("button");
    // assert
    expect(card).toHaveClass("bg-white");
    expect(heading).toHaveTextContent("Sarah Jenkins");
    expect(employeeInfo).toHaveLength(3);
    expect(employeeInfo[0]).toHaveTextContent("Software Developer");
    expect(employeeInfo[1]).toHaveTextContent("sarah.jenkins@example.com");
    expect(employeeInfo[2]).toHaveTextContent("Joined 2021-03-15");
    expect(viewLink).toHaveAttribute("href", "/1");
    expect(deleteBtn).toHaveTextContent("Delete");
    expect(screen.queryByLabelText("Loading spinner")).not.toBeInTheDocument();
  });

  it("Should call mutation on useDeleteEmployee with correct values when button clicked", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <EmployeeCard employee={employee} bgColor="bg-white" />
      </MemoryRouter>,
    );
    // act
    expect(mockMutate).not.toHaveBeenCalled();
    const deleteBtn = screen.getByRole("button");
    await user.click(deleteBtn);
    // assert
    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        addressId: 4,
        id: 1,
      }),
      {
        onError: expect.any(Function),
      },
    );
  });

  it("Should have a specific toast message on deleting a manager error", async () => {
    // arrange
    const user = userEvent.setup();
    vi.mocked(useDeleteEmployee).mockReturnValue({
      mutate: mockMutate.mockImplementation((_variables, options) => {
        options.onError(
          new Error(
            "Cannot delete this employee as they are currently a manager of other employee(s)",
          ),
        );
      }),
      isPending: false,
    } as any);
    render(
      <MemoryRouter>
        <EmployeeCard employee={employee} bgColor="bg-white" />
      </MemoryRouter>,
    );
    // act
    const deleteBtn = screen.getByRole("button");
    await user.click(deleteBtn);
    // assert
    expect(toast.error).toHaveBeenCalledWith(
      "Cannot delete this employee as they are currently a manager of other employee(s)",
    );
  });

  it("Should have a default toast message on a general delete error", async () => {
    // arrange
    const user = userEvent.setup();
    vi.mocked(useDeleteEmployee).mockReturnValue({
      mutate: mockMutate.mockImplementation((_variables, options) => {
        options.onError(new Error("Deletion error"));
      }),
      isPending: false,
    } as any);
    render(
      <MemoryRouter>
        <EmployeeCard employee={employee} bgColor="bg-white" />
      </MemoryRouter>,
    );
    // act
    const deleteBtn = screen.getByRole("button");
    await user.click(deleteBtn);
    // assert
    expect(toast.error).toHaveBeenCalledWith(
      "Oops, something went wrong when deleting this employee.",
    );
  });

  it("Should render loading spinner when delete is pending", async () => {
    // arrange
    vi.mocked(useDeleteEmployee).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);
    render(
      <MemoryRouter>
        <EmployeeCard employee={employee} bgColor="bg-white" />
      </MemoryRouter>,
    );
    // act
    const loadingSpinner = screen.getByLabelText("Loading spinner");
    // assert
    expect(loadingSpinner).toBeInTheDocument();
  });
});
