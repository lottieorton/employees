import { render, screen } from "@testing-library/react";
import { useCreateEmployee } from "../../../hooks/useEmployees";
import CreateEmployeePage from "./CreateEmployeePage";
import { MemoryRouter } from "react-router-dom";
import type { EmployeeFormProps } from "../../../interfaces/formInterfaces";
import userEvent from "@testing-library/user-event";
import { createAddress } from "../../../services/addresses-service";
import { toast } from "react-toastify";

vi.mock("../../../hooks/useEmployees", () => ({
  useCreateEmployee: vi.fn(),
}));

vi.mock("../../../services/addresses-service", () => ({
  createAddress: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

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
              handlePageSubmit(mockFormData);
            }}
          >
            {submitBtnText}
          </button>
        </form>
        <button onClick={() => handleWarningClick()}>{warningBtnText}</button>
      </div>
    );
  },
}));

describe("CreateEmployeePage", () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useCreateEmployee).mockReturnValue({
      mutateAsync: mockMutateAsync,
    } as any);
  });

  it("Should render component passing down props to children with link back to team page", () => {
    // arrange
    render(
      <MemoryRouter>
        <CreateEmployeePage />
      </MemoryRouter>,
    );
    // act
    const backToTeamLink = screen.getByText("← Back to Team");
    const heading = screen.getByRole("heading", { level: 1 });
    const formHasEmail = screen.getByText("hasEmail false");
    const submitBtn = screen.getByRole("button", { name: "Create Employee" });
    const cancelbtn = screen.getByRole("button", { name: "Cancel" });
    // assert
    expect(backToTeamLink).toHaveAttribute("href", "/");
    expect(heading).toHaveTextContent("Create New Employee");
    expect(formHasEmail).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(cancelbtn).toBeInTheDocument();
  });

  it("Should call employees and addresses functions with correct values on successful submit", async () => {
    // arrange
    const user = userEvent.setup();
    vi.mocked(createAddress).mockResolvedValue({
      id: 1,
      unitNumber: "30",
      streetAddress: "Park Lane",
      addressLine2: "Suite 4",
      city: "Sydney",
      stateProvinceRegion: "NSW",
      postalCode: "2000",
      country: "Australia",
    });

    vi.mocked(mockMutateAsync).mockResolvedValue({
      id: 1,
    });
    render(
      <MemoryRouter>
        <CreateEmployeePage />
      </MemoryRouter>,
    );
    // act
    const submitBtn = screen.getByRole("button", { name: "Create Employee" });
    await user.click(submitBtn);
    // assert
    expect(createAddress).toHaveBeenCalledOnce();
    expect(createAddress).toHaveBeenCalledWith(
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
    expect(mockMutateAsync).toHaveBeenCalledOnce();
    expect(mockMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        pronouns: "She/Her",
        firstName: "Sarah",
        middleName: "Marie",
        lastName: "Jenkins",
        preferredName: "SJ",
        emailAddress: "sarah.jenkins@example.com",
        phoneNumber: "+61412345678",
        addressId: 1,
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
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("Should render loading text when waiting in loading state waiting on submission", async () => {
    // arrange
    const user = userEvent.setup();
    let resolveAddress!: (value: any) => void;
    const addressPromise = new Promise((resolve) => {
      resolveAddress = resolve;
    });
    vi.mocked(createAddress).mockImplementation(() => addressPromise as any);
    render(
      <MemoryRouter>
        <CreateEmployeePage />
      </MemoryRouter>,
    );
    // act
    const submitBtn = screen.getByRole("button", { name: "Create Employee" });
    await user.click(submitBtn);
    // assert
    expect(submitBtn).toHaveTextContent("Creating...");
    resolveAddress({ id: 1 });
  });

  it("Should show error message on error creating employee", async () => {
    // arrange
    const user = userEvent.setup();
    vi.mocked(createAddress).mockRejectedValue(
      new Error("Error creating address"),
    );
    render(
      <MemoryRouter>
        <CreateEmployeePage />
      </MemoryRouter>,
    );
    // act
    const submitBtn = screen.getByRole("button", { name: "Create Employee" });
    await user.click(submitBtn);
    // assert
    expect(createAddress).toHaveBeenCalledOnce();
    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledOnce();
    expect(toast.error).toHaveBeenCalledWith(
      "Oops, something went wrong when creating this employee",
    );
    expect(submitBtn).toHaveTextContent("Create Employee");
  });

  it("Should navigate to homepage on cancel click", async () => {
    // arrange
    const user = userEvent.setup();
    vi.mocked(createAddress).mockRejectedValue(
      new Error("Error creating address"),
    );
    render(
      <MemoryRouter>
        <CreateEmployeePage />
      </MemoryRouter>,
    );
    // act
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelBtn);
    // assert
    expect(mockNavigate).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
