import { render, screen, within } from "@testing-library/react";
import type { Employee } from "../../interfaces/Employee";
import EmployeeList from "./EmployeeList";
import { toast } from "react-toastify";
import { useDeleteEmployee } from "../../hooks/useEmployees";
import userEvent from "@testing-library/user-event";

vi.mock("../EmployeeCard/EmployeeCard", () => ({
  default: ({
    employee,
    bgColor,
    openModal,
  }: {
    employee: Employee;
    bgColor: string;
    openModal: (e: Employee) => void;
  }) => {
    return (
      <article aria-label={bgColor}>
        <div>{`${employee.id} ${employee.firstName}`}</div>
        <button onClick={() => openModal(employee)}>
          Open modal {employee.firstName}
        </button>
      </article>
    );
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../../hooks/useEmployees", () => ({
  useDeleteEmployee: vi.fn(),
}));

vi.mock("../Modal/Modal", () => ({
  default: ({
    firstName,
    lastName,
    role,
    handleClick,
    closeModal,
    actionText,
  }: {
    firstName: string;
    lastName: string;
    role: string;
    handleClick: () => void;
    closeModal: () => void;
    actionText: string;
  }) => {
    return (
      <section data-testid="mock-modal">
        <p>{`${firstName} ${lastName}`}</p>
        <p>{`${role}`}</p>
        <button onClick={closeModal}>Close</button>
        <button onClick={handleClick}>{actionText}</button>
      </section>
    );
  },
}));

describe("EmployeeList", () => {
  const mockMutate = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useDeleteEmployee).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

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
    expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
  });

  it("Should render modal with correct details when open function called from card", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <EmployeeList
        searchTerm=""
        employees={employees}
        isLoading={false}
        isError={false}
      />,
    );
    // act
    const openBtn = screen.getByRole("button", { name: "Open modal Alex" });
    await user.click(openBtn);
    const modal = screen.getByTestId("mock-modal");
    // assert
    expect(modal).toBeInTheDocument();
    const modalView = within(modal);
    expect(modalView.getByText("Alex Rivera")).toBeInTheDocument();
    expect(
      modalView.getByText("Software Developer - Engineering"),
    ).toBeInTheDocument();
    expect(
      modalView.getByRole("button", { name: "Delete" }),
    ).toBeInTheDocument();
  });

  it("Should close the modal when the closeModal function is called", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <EmployeeList
        searchTerm=""
        employees={employees}
        isLoading={false}
        isError={false}
      />,
    );
    // act
    const openBtn = screen.getByRole("button", { name: "Open modal Alex" });
    await user.click(openBtn);
    const modal = screen.queryByTestId("mock-modal");
    expect(modal).toBeInTheDocument();
    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(closeBtn);
    // assert
    expect(modal).not.toBeInTheDocument();
  });

  it("Should call mutation on useDeleteEmployee with correct values when modal calls delete", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <EmployeeList
        searchTerm=""
        employees={employees}
        isLoading={false}
        isError={false}
      />,
    );
    // act
    expect(mockMutate).not.toHaveBeenCalled();
    const openBtn = screen.getByRole("button", { name: "Open modal Alex" });
    await user.click(openBtn);
    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteBtn);
    // assert
    expect(mockMutate).toHaveBeenCalledOnce();
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        addressId: 5,
        id: 2,
      }),
      {
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      },
    );
  });

  it("Should close the modal on success of deleting employee", async () => {
    // arrange
    const user = userEvent.setup();
    vi.mocked(useDeleteEmployee).mockReturnValue({
      mutate: mockMutate.mockImplementation((_variables, options) => {
        options.onSuccess();
      }),
    } as any);
    render(
      <EmployeeList
        searchTerm=""
        employees={employees}
        isLoading={false}
        isError={false}
      />,
    );
    // act
    expect(mockMutate).not.toHaveBeenCalled();
    const openBtn = screen.getByRole("button", { name: "Open modal Alex" });
    await user.click(openBtn);
    const modal = screen.queryByTestId("mock-modal");
    expect(modal).toBeInTheDocument();
    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteBtn);
    // assert
    expect(mockMutate).toHaveBeenCalledOnce();
    expect(modal).not.toBeInTheDocument();
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
      <EmployeeList
        searchTerm=""
        employees={employees}
        isLoading={false}
        isError={false}
      />,
    );
    // act
    expect(mockMutate).not.toHaveBeenCalled();
    const openBtn = screen.getByRole("button", { name: "Open modal Alex" });
    await user.click(openBtn);
    const modal = screen.getByTestId("mock-modal");
    expect(modal).toBeInTheDocument();
    const deleteBtn = screen.getByRole("button", { name: "Delete" });
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
      <EmployeeList
        searchTerm=""
        employees={employees}
        isLoading={false}
        isError={false}
      />,
    );
    // act
    expect(mockMutate).not.toHaveBeenCalled();
    const openBtn = screen.getByRole("button", { name: "Open modal Alex" });
    await user.click(openBtn);
    const modal = screen.getByTestId("mock-modal");
    expect(modal).toBeInTheDocument();
    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteBtn);
    // assert
    expect(toast.error).toHaveBeenCalledWith(
      "Oops, something went wrong when deleting this employee.",
    );
  });

  it("Should update delete button text when delete is pending", async () => {
    // arrange
    const user = userEvent.setup();
    vi.mocked(useDeleteEmployee).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);
    render(
      <EmployeeList
        searchTerm=""
        employees={employees}
        isLoading={false}
        isError={false}
      />,
    );
    // act
    expect(mockMutate).not.toHaveBeenCalled();
    const openBtn = screen.getByRole("button", { name: "Open modal Alex" });
    await user.click(openBtn);
    const deleteBtn = screen.getByRole("button", { name: "Deleting..." });
    // assert
    expect(deleteBtn).toBeInTheDocument();
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
