import { render, screen } from "@testing-library/react";
import EmployeeCard from "./EmployeeCard";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("Employee Card", () => {
  const mockOpenModal = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
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
        <EmployeeCard
          employee={employee}
          bgColor="bg-white"
          openModal={mockOpenModal}
        />
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

  it("Should call openModal when delete button clicked", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <EmployeeCard
          employee={employee}
          bgColor="bg-white"
          openModal={mockOpenModal}
        />
      </MemoryRouter>,
    );
    // act
    expect(mockOpenModal).not.toHaveBeenCalled();
    const deleteBtn = screen.getByRole("button");
    await user.click(deleteBtn);
    // assert
    expect(mockOpenModal).toHaveBeenCalledOnce();
    expect(mockOpenModal).toHaveBeenCalledWith(employee);
  });
});
