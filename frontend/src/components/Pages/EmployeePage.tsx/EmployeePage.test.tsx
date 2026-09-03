import { render, screen } from "@testing-library/react";
import EmployeePage from "./EmployeePage";
import {
  useDeleteEmployee,
  useEmployee,
  useUpdateEmployee,
} from "../../../hooks/useEmployees";
import type { EmployeeFormProps } from "../../../interfaces/formInterfaces";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { updateAddress } from "../../../services/addresses-service";
import { toast } from "react-toastify";

vi.mock("../../../hooks/useEmployees", () => ({
  useEmployee: vi.fn(),
  useUpdateEmployee: vi.fn(),
  useDeleteEmployee: vi.fn(),
}));

vi.mock("../../../services/addresses-service", () => ({
  updateAddress: vi.fn(),
}));

vi.mock("../../EmployeeDetails/EmployeeDetails", () => ({
  default: ({ employee }: { employee: any }) => (
    <div data-testid="mock-employee-details">
      Employee Details for {employee.firstName}
    </div>
  ),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../EmployeeForm/EmployeeForm", () => ({
  default: ({
    handlePageSubmit,
    handleWarningClick,
    submitBtnText,
    warningBtnText,
    hasEmail,
  }: EmployeeFormProps) => {
    const mockFormData = {
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
      lastDate: "",
      isCurrentlyEmployed: true,
    };
    return (
      <div data-testid="mock-employee-form">
        <p>{`hasEmail ${hasEmail}`}</p>
        <form>
          <button
            onClick={(e) => {
              e.preventDefault();
              handlePageSubmit(mockFormData, 1, 2);
            }}
          >
            {submitBtnText}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              handlePageSubmit(mockFormData);
            }}
          >
            Submit without ids
          </button>
        </form>
        <button onClick={() => handleWarningClick()}>{warningBtnText}</button>
      </div>
    );
  },
}));

describe("EmployeePage", () => {
  const mockUpdateMutateAsync = vi.fn();
  const mockDeleteMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUpdateEmployee).mockReturnValue({
      mutateAsync: mockUpdateMutateAsync,
    } as any);
    vi.mocked(useDeleteEmployee).mockReturnValue({
      mutate: mockDeleteMutate,
    } as any);

    vi.mocked(useEmployee).mockReturnValue({
      data: {
        id: 1,
        firstName: "Sarah",
        lastName: "Jenkins",
        emailAddress: "sarah@example.com",
        role: { name: "Software Developer" },
        address: { id: 2 },
      },
      isLoading: false,
      isError: false,
    } as any);
  });

  it("Should render component with default view setting", () => {
    // arrange
    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const backToTeamLink = screen.getByText("← Back to Team");
    const viewEditBtn = screen.getByRole("button", { name: "Edit" });
    const fullName = screen.getByRole("heading", { level: 1 });
    const role = screen.getByRole("paragraph");
    const employeeDetails = screen.getByTestId("mock-employee-details");
    // assert
    expect(backToTeamLink).toHaveAttribute("href", "/");
    expect(viewEditBtn).toBeInTheDocument();
    expect(fullName).toHaveTextContent("Sarah Jenkins");
    expect(role).toHaveTextContent("Software Developer");
    expect(employeeDetails).toHaveTextContent("Employee Details for Sarah");
  });

  it("Should render preferred name within the header when provided", () => {
    // arrange
    vi.mocked(useEmployee).mockReturnValue({
      data: {
        id: 1,
        firstName: "Sarah",
        preferredName: "SJ",
        lastName: "Jenkins",
        emailAddress: "sarah@example.com",
        role: { name: "Software Developer" },
      },
      isLoading: false,
      isError: false,
    } as any);
    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const fullName = screen.getByRole("heading", { level: 1 });
    // assert
    expect(fullName).toHaveTextContent("Sarah (SJ) Jenkins");
  });

  it("Should toggle edit view when press View link", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const viewEditBtn = screen.getByRole("button", { name: "Edit" });
    const employeeDetails = screen.getByTestId("mock-employee-details");
    expect(employeeDetails).toBeInTheDocument();
    await user.click(viewEditBtn);
    // assert
    expect(viewEditBtn).toHaveTextContent("View");
    expect(
      screen.getByRole("button", { name: "Save Changes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Employee" }),
    ).toBeInTheDocument();
    expect(employeeDetails).not.toBeInTheDocument();
  });

  it("Should toggle view mode back on when press the View button is clicked", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const viewEditBtn = screen.getByRole("button", { name: "Edit" });
    const employeeDetails = screen.getByTestId("mock-employee-details");
    expect(employeeDetails).toBeInTheDocument();
    await user.click(viewEditBtn);
    expect(viewEditBtn).toHaveTextContent("View");
    const formSubmitBtn = screen.getByRole("button", { name: "Save Changes" });
    expect(formSubmitBtn).toBeInTheDocument();
    expect(employeeDetails).not.toBeInTheDocument();
    await user.click(viewEditBtn);
    // assert
    expect(viewEditBtn).toHaveTextContent("Edit");
    expect(formSubmitBtn).not.toBeInTheDocument();
  });

  it("Should render loading message on loading", () => {
    // arrange
    vi.mocked(useEmployee).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    } as any);

    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const backToTeamLink = screen.getByText("← Back to Team");
    const loadingMsg = screen.getByText("Loading employee details...");
    // assert
    expect(backToTeamLink).toHaveAttribute("href", "/");
    expect(loadingMsg).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("Should render error message on fetching error", () => {
    // arrange
    vi.mocked(useEmployee).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    } as any);

    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const backToTeamLink = screen.getByText("← Back to Team");
    const errorMsg = screen.getByText(
      "Failed to load employee details. Please try refreshing the page.",
    );
    // assert
    expect(backToTeamLink).toHaveAttribute("href", "/");
    expect(errorMsg).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("Should render error message if there's no employee", () => {
    // arrange
    vi.mocked(useEmployee).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    } as any);

    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const backToTeamLink = screen.getByText("← Back to Team");
    const errorMsg = screen.getByText(
      "Failed to load employee details. Please try refreshing the page.",
    );
    // assert
    expect(backToTeamLink).toHaveAttribute("href", "/");
    expect(errorMsg).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("Should call updateAddress and updateEmploye on toggle back to view mode on successful update submission", async () => {
    // arrange
    const user = userEvent.setup();

    vi.mocked(updateAddress).mockResolvedValue({
      id: 2,
      unitNumber: "30",
      streetAddress: "Park Lane",
      city: "Sydney",
      stateProvinceRegion: "NSW",
      postalCode: "2000",
      country: "Australia",
    } as any);

    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const viewEditBtn = screen.getByRole("button", { name: "Edit" });
    const employeeDetails = screen.getByTestId("mock-employee-details");
    await user.click(viewEditBtn);
    expect(viewEditBtn).toHaveTextContent("View");
    const formSubmitBtn = screen.getByRole("button", { name: "Save Changes" });
    await user.click(formSubmitBtn);
    // assert
    expect(formSubmitBtn).toHaveTextContent("Saving...");
    expect(updateAddress).toHaveBeenCalledOnce();
    expect(updateAddress).toHaveBeenCalledWith(
      2,
      expect.objectContaining({
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
        lastDate: "",
        isCurrentlyEmployed: true,
      }),
    );
    expect(mockUpdateMutateAsync).toHaveBeenCalledOnce();
    expect(mockUpdateMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        formData: {
          pronouns: "She/Her",
          firstName: "Sarah",
          middleName: "Marie",
          lastName: "Jenkins",
          preferredName: "SJ",
          emailAddress: "sarah.jenkins@example.com",
          phoneNumber: "+61412345678",
          addressId: 2,
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
          lastDate: "",
          isCurrentlyEmployed: true,
        },
        id: 1,
      }),
    );
    expect(viewEditBtn).toHaveTextContent("Edit");
    expect(formSubmitBtn).not.toBeInTheDocument();
    expect(employeeDetails).not.toBeInTheDocument();
  });

  it("Should render an error message if no ids are passed into the handleSubmit", async () => {
    // arrange
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const viewEditBtn = screen.getByRole("button", { name: "Edit" });
    await user.click(viewEditBtn);
    expect(viewEditBtn).toHaveTextContent("View");
    const invalidFormSubmitBtn = screen.getByRole("button", {
      name: "Submit without ids",
    });
    await user.click(invalidFormSubmitBtn);
    // assert
    expect(updateAddress).not.toHaveBeenCalled();
    expect(mockUpdateMutateAsync).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledOnce();
    expect(toast.error).toHaveBeenCalledWith(
      "Oops something went wrong with trying to update this employee",
    );
  });

  it("Should render an error message on error of update submission", async () => {
    // arrange
    const user = userEvent.setup();

    vi.mocked(updateAddress).mockRejectedValue(
      new Error("Issue with updating address"),
    );

    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const viewEditBtn = screen.getByRole("button", { name: "Edit" });
    await user.click(viewEditBtn);
    expect(viewEditBtn).toHaveTextContent("View");
    const formSubmitBtn = screen.getByRole("button", { name: "Save Changes" });
    await user.click(formSubmitBtn);
    // assert
    expect(updateAddress).toHaveBeenCalledOnce();
    expect(mockUpdateMutateAsync).not.toHaveBeenCalled();
    expect(viewEditBtn).toHaveTextContent("View");
    expect(toast.error).toHaveBeenCalledOnce();
    expect(toast.error).toHaveBeenCalledWith(
      "Oops something went wrong with trying to update this employee",
    );
    expect(formSubmitBtn).toHaveTextContent("Save Changes");
  });

  it("Should render a custom email address error message on error of update submission due to duplicate email addresses", async () => {
    // arrange
    const user = userEvent.setup();

    vi.mocked(updateAddress).mockResolvedValue({
      id: 2,
      unitNumber: "30",
      streetAddress: "Park Lane",
      city: "Sydney",
      stateProvinceRegion: "NSW",
      postalCode: "2000",
      country: "Australia",
    } as any);

    vi.mocked(mockUpdateMutateAsync).mockRejectedValue(
      new Error("This email address is already in use. Please use another"),
    );

    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const viewEditBtn = screen.getByRole("button", { name: "Edit" });
    await user.click(viewEditBtn);
    expect(viewEditBtn).toHaveTextContent("View");
    const formSubmitBtn = screen.getByRole("button", { name: "Save Changes" });
    await user.click(formSubmitBtn);
    // assert
    expect(updateAddress).toHaveBeenCalledOnce();
    expect(mockUpdateMutateAsync).toHaveBeenCalled();
    expect(viewEditBtn).toHaveTextContent("View");
    expect(toast.error).toHaveBeenCalledOnce();
    expect(toast.error).toHaveBeenCalledWith(
      "This email address is already in use. Please use another",
    );
    expect(formSubmitBtn).toHaveTextContent("Save Changes");
  });

  it("Should call delete employee on click warning button and navigate to homepage on successful delete", async () => {
    // arrange
    mockDeleteMutate.mockImplementation((_variables, options) => {
      options.onSuccess();
    });
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const viewEditBtn = screen.getByRole("button", { name: "Edit" });
    await user.click(viewEditBtn);
    expect(viewEditBtn).toHaveTextContent("View");
    const deleteBtn = screen.getByRole("button", { name: "Delete Employee" });
    await user.click(deleteBtn);
    // assert
    expect(deleteBtn).toHaveTextContent("Deleting...");
    expect(mockDeleteMutate).toHaveBeenCalledOnce();
    expect(mockDeleteMutate).toHaveBeenCalledWith(
      { addressId: 2, id: 1 },
      expect.objectContaining({
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      }),
    );
    expect(mockNavigate).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("Should update warning button text while deleting is pending", async () => {
    const user = userEvent.setup();
    mockDeleteMutate.mockImplementation(() => {});

    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );

    // act
    const viewEditBtn = screen.getByRole("button", { name: "Edit" });
    await user.click(viewEditBtn);
    expect(viewEditBtn).toHaveTextContent("View");
    const deleteBtn = screen.getByRole("button", { name: "Delete Employee" });
    await user.click(deleteBtn);
    expect(deleteBtn).toHaveTextContent("Deleting...");
  });

  it("Should do nothing if no employee provided when click delete button", () => {
    // arrange
    vi.mocked(useEmployee).mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
    } as any);
    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // assert
    expect(
      screen.queryByRole("button", { name: "Delete Employee" }),
    ).not.toBeInTheDocument();
    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });

  it("Should render error message on error deleting manager", async () => {
    // arrange
    mockDeleteMutate.mockImplementation((_variables, options) => {
      options.onError(
        new Error(
          "Cannot delete this employee as they are currently a manager of other employee(s)",
        ),
      );
    });
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const viewEditBtn = screen.getByRole("button", { name: "Edit" });
    await user.click(viewEditBtn);
    expect(viewEditBtn).toHaveTextContent("View");
    const deleteBtn = screen.getByRole("button", { name: "Delete Employee" });
    await user.click(deleteBtn);
    // assert
    expect(mockDeleteMutate).toHaveBeenCalledOnce();
    expect(mockDeleteMutate).toHaveBeenCalledWith(
      { addressId: 2, id: 1 },
      expect.objectContaining({
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      }),
    );
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledOnce();
    expect(toast.error).toHaveBeenCalledWith(
      "Cannot delete this employee as they are currently a manager of other employee(s)",
    );
    expect(deleteBtn).toHaveTextContent("Delete Employee");
  });

  it("Should render general error message on error deleting employee", async () => {
    // arrange
    mockDeleteMutate.mockImplementation((_variables, options) => {
      options.onError(new Error("Something went wrong"));
    });
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <EmployeePage />
      </MemoryRouter>,
    );
    // act
    const viewEditBtn = screen.getByRole("button", { name: "Edit" });
    await user.click(viewEditBtn);
    expect(viewEditBtn).toHaveTextContent("View");
    const deleteBtn = screen.getByRole("button", { name: "Delete Employee" });
    await user.click(deleteBtn);
    // assert
    expect(mockDeleteMutate).toHaveBeenCalledOnce();
    expect(mockDeleteMutate).toHaveBeenCalledWith(
      { addressId: 2, id: 1 },
      expect.objectContaining({
        onError: expect.any(Function),
        onSuccess: expect.any(Function),
      }),
    );
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledOnce();
    expect(toast.error).toHaveBeenCalledWith(
      "Oops, something went wrong when deleting this employee.",
    );
    expect(deleteBtn).toHaveTextContent("Delete Employee");
  });
});
