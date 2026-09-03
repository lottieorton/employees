import { render, screen } from "@testing-library/react";
import { useEmployeeFormOptions } from "../../hooks/useEmployeeFormOptions";
import EmployeeForm from "./EmployeeForm";
import userEvent from "@testing-library/user-event";

vi.mock("../../hooks/useEmployeeFormOptions", () => ({
  useEmployeeFormOptions: vi.fn(),
}));

describe("EmployeeForm", () => {
  const mockedHandlePageSubmit = vi.fn();
  const mockedHandleWarningClick = vi.fn();

  const mockFormOptions = {
    employmentType: [
      { label: "Full-Time Permanent", value: "Full-Time Permanent" },
      { label: "Part-Time Permanent", value: "Part-Time Permanent" },
      { label: "Contractor", value: "Contractor" },
      { label: "Blank Employment", value: "" },
    ],
    pronouns: [
      { label: "He/Him", value: "He/Him" },
      { label: "She/Her", value: "She/Her" },
      { label: "They/Them", value: "They/Them" },
    ],
    workSetup: [
      { label: "Onsite", value: "Onsite" },
      { label: "Hybrid", value: "Hybrid" },
      { label: "Remote", value: "Remote" },
      { label: "Blank Work Setup", value: "" },
    ],
  };

  const mockGetUniqueOptions = vi.fn((key: string) => {
    if (key === "name") {
      return [
        { label: "Software Developer", value: "Software Developer" },
        { label: "QA / Test Engineer", value: "QA / Test Engineer" },
      ];
    }
    if (key === "seniorityLevel") {
      return [
        { label: "Junior", value: "Junior" },
        { label: "Mid", value: "Mid" },
      ];
    }
    if (key === "department") {
      return [{ label: "Engineering", value: "Engineering" }];
    }
    return [];
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

  const mockGetSelectedRoleId = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useEmployeeFormOptions).mockReturnValue({
      formOptions: mockFormOptions,
      managerOptions: [
        { value: 1, label: "Sarah Jenkins (Senior Software Dev)" },
        { value: 2, label: "Alex Rivera (Software Dev)" },
      ],
      getUniqueOptions: mockGetUniqueOptions,
      getSelectedRoleId: mockGetSelectedRoleId,
      isLoading: false,
      hasError: false,
    });

    vi.mocked(mockGetSelectedRoleId).mockReturnValue(1);
  });

  it("Should render form with no initialised inputs when no employee", () => {
    // arrange
    render(
      <EmployeeForm
        handlePageSubmit={mockedHandlePageSubmit}
        handleWarningClick={mockedHandleWarningClick}
        submitBtnText={"Create Employee"}
        warningBtnText={"Cancel"}
      />,
    );
    // act
    const expectedTextInputs = [
      /first name/i,
      /middle name/i,
      /last name/i,
      /preferred name/i,
      /email address/i,
      /phone number/i,
      /unit number/i,
      /street address/i,
      /address line 2/i,
      /city/i,
      /state\/province\/region/i,
      /postal code/i,
      /country/i,
    ];
    const expectedSelects = [
      /pronouns/i,
      /role name/i,
      /seniority/i,
      /department/i,
      /manager/i,
    ];
    const expectedRadio = [
      /onsite/i,
      /hybrid/i,
      /remote/i,
      /full-time permanent/i,
      /part-time permanent/i,
      /contractor/i,
    ];
    const sectionHeaders = screen.getAllByRole("heading", { level: 3 });
    // assert
    expect(sectionHeaders).toHaveLength(3);
    expect(sectionHeaders[0]).toHaveTextContent("Personal Information");
    expect(sectionHeaders[1]).toHaveTextContent("Contact Information");
    expect(sectionHeaders[2]).toHaveTextContent("Employment Information");
    expectedTextInputs.forEach((label) => {
      expect(screen.getByRole("textbox", { name: label })).toHaveValue("");
    });
    expectedSelects.forEach((label) => {
      expect(screen.getByRole("combobox", { name: label })).toHaveValue("");
    });
    expectedRadio.forEach((label) => {
      expect(screen.getByRole("radio", { name: label })).not.toBeChecked();
    });
    expect(screen.getByLabelText("Start Date *")).toHaveValue("");
    expect(screen.getByLabelText("Last Date")).toHaveValue("");
    expect(
      screen.getByRole("checkbox", { name: "Currently Employed" }),
    ).toBeChecked();
    expect(
      screen.getByRole("button", { name: "Create Employee" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("Should submit form with populated values when submitted successfully", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <EmployeeForm
        handlePageSubmit={mockedHandlePageSubmit}
        handleWarningClick={mockedHandleWarningClick}
        submitBtnText={"Create Employee"}
        warningBtnText={"Cancel"}
      />,
    );
    // act
    const submitBtn = screen.getByRole("button", { name: "Create Employee" });
    await user.selectOptions(screen.getByLabelText("Pronouns *"), "She/Her");
    await user.type(screen.getByLabelText("First Name *"), "Sarah");
    await user.type(screen.getByLabelText("Middle Name"), "Maria");
    await user.type(screen.getByLabelText("Last Name *"), "Jenkins");
    await user.type(screen.getByLabelText("Preferred Name"), "SJ");
    await user.type(
      screen.getByLabelText("Email Address *"),
      "sarah.jenkins@example.com",
    );
    await user.type(screen.getByLabelText("Phone Number *"), "+61412345678");
    await user.type(screen.getByLabelText("Unit Number *"), "30");
    await user.type(screen.getByLabelText("Street Address *"), "Park Lane");
    await user.type(
      screen.getByLabelText("Address Line 2"),
      "Leicester Square",
    );
    await user.type(screen.getByLabelText("City *"), "London");
    await user.type(screen.getByLabelText("State/Province/Region"), "Mayfair");
    await user.type(screen.getByLabelText("Postal Code *"), "E1 1GB");
    await user.type(screen.getByLabelText("Country *"), "England");
    await user.selectOptions(
      screen.getByLabelText("Role Name *"),
      "Software Developer",
    );
    await user.selectOptions(screen.getByLabelText("Seniority *"), "Junior");
    await user.selectOptions(
      screen.getByLabelText("Department *"),
      "Engineering",
    );
    await user.selectOptions(
      screen.getByLabelText("Manager"),
      "Alex Rivera (Software Dev)",
    );
    await user.click(screen.getByRole("radio", { name: "Onsite" }));
    await user.click(
      screen.getByRole("radio", { name: "Full-Time Permanent" }),
    );
    await user.type(screen.getByLabelText("Start Date *"), "2021-03-15");
    await user.type(screen.getByLabelText("Last Date"), "2026-03-15");
    await user.click(
      screen.getByRole("checkbox", { name: "Currently Employed" }),
    );
    await user.click(submitBtn);
    // assert
    expect(mockGetSelectedRoleId).toHaveBeenCalledOnce();
    expect(mockedHandlePageSubmit).toHaveBeenCalledOnce();
    expect(mockedHandlePageSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        pronouns: "She/Her",
        firstName: "Sarah",
        middleName: "Maria",
        lastName: "Jenkins",
        preferredName: "SJ",
        emailAddress: "sarah.jenkins@example.com",
        phoneNumber: "+61412345678",
        unitNumber: "30",
        streetAddress: "Park Lane",
        addressLine2: "Leicester Square",
        city: "London",
        stateProvinceRegion: "Mayfair",
        postalCode: "E1 1GB",
        country: "England",
        roleId: 1,
        roleName: "Software Developer",
        seniorityLevel: "Junior",
        department: "Engineering",
        managerId: "2",
        workSetup: "Onsite",
        employmentType: "Full-Time Permanent",
        startDate: "2021-03-15",
        lastDate: "2026-03-15",
        isCurrentlyEmployed: false,
      }),
    );
  });

  it("Should render form without email input when hasEmail prop is false", () => {
    // arrange
    render(
      <EmployeeForm
        handlePageSubmit={mockedHandlePageSubmit}
        handleWarningClick={mockedHandleWarningClick}
        submitBtnText={"Create Employee"}
        warningBtnText={"Cancel"}
        hasEmail={false}
      />,
    );
    // act
    expect(screen.queryByLabelText("Email Address *")).not.toBeInTheDocument();
  });

  it("Should render form with default values when employee is provided", async () => {
    // arrange
    render(
      <EmployeeForm
        handlePageSubmit={mockedHandlePageSubmit}
        handleWarningClick={mockedHandleWarningClick}
        submitBtnText={"Create Employee"}
        warningBtnText={"Cancel"}
        employee={employee}
      />,
    );
    // act
    expect(screen.getByLabelText("Pronouns *")).toHaveTextContent("She/Her");
    expect(screen.getByLabelText("First Name *")).toHaveValue("Sarah");
    expect(screen.getByLabelText("Middle Name")).toHaveValue("Marie");
    expect(screen.getByLabelText("Last Name *")).toHaveValue("Jenkins");
    expect(screen.getByLabelText("Preferred Name")).toHaveValue("SJ");
    expect(screen.getByLabelText("Email Address *")).toHaveValue(
      "sarah.jenkins@example.com",
    );
    expect(screen.getByLabelText("Phone Number *")).toHaveValue("+61412345678");
    expect(screen.getByLabelText("Unit Number *")).toHaveValue("30");
    expect(screen.getByLabelText("Street Address *")).toHaveValue("Park Lane");
    expect(screen.getByLabelText("Address Line 2")).toHaveValue(
      "Leicester Square",
    );
    expect(screen.getByLabelText("City *")).toHaveValue("London");
    expect(screen.getByLabelText("State/Province/Region")).toHaveValue(
      "Mayfair",
    );
    expect(screen.getByLabelText("Postal Code *")).toHaveValue("E1 1GB");
    expect(screen.getByLabelText("Country *")).toHaveValue("England");
    expect(screen.getByLabelText("Role Name *")).toHaveTextContent(
      "Software Developer",
    );
    expect(screen.getByLabelText("Seniority *")).toHaveTextContent("Junior");
    expect(screen.getByLabelText("Department *")).toHaveTextContent(
      "Engineering",
    );
    expect(screen.getByLabelText("Manager")).toHaveTextContent(
      "Alex Rivera (Software Dev)",
    );
    expect(screen.getByRole("radio", { name: "Onsite" })).toBeChecked();
    expect(
      screen.getByRole("radio", { name: "Full-Time Permanent" }),
    ).toBeChecked();
    expect(screen.getByLabelText("Start Date *")).toHaveValue("2021-03-15");
    expect(screen.getByLabelText("Last Date")).toHaveValue("");
    expect(
      screen.getByRole("checkbox", { name: "Currently Employed" }),
    ).toBeChecked();
  });

  it("Should call handleWarningClick when warning btn is clicked", async () => {
    //arrange
    const user = userEvent.setup();
    render(
      <EmployeeForm
        handlePageSubmit={mockedHandlePageSubmit}
        handleWarningClick={mockedHandleWarningClick}
        submitBtnText={"Create Employee"}
        warningBtnText={"Cancel"}
      />,
    );
    // act
    const warningBtn = screen.getByRole("button", { name: "Cancel" });
    await user.click(warningBtn);
    // assert
    expect(mockedHandleWarningClick).toHaveBeenCalledOnce();
  });

  it("Should render error message when form data has a fetching error", async () => {
    // arrange
    vi.mocked(useEmployeeFormOptions).mockReturnValue({
      formOptions: mockFormOptions,
      managerOptions: [
        { value: 1, label: "Sarah Jenkins (Senior Software Dev)" },
        { value: 2, label: "Alex Rivera (Software Dev)" },
      ],
      getUniqueOptions: mockGetUniqueOptions,
      getSelectedRoleId: vi.fn(),
      isLoading: false,
      hasError: true,
    });
    render(
      <EmployeeForm
        handlePageSubmit={mockedHandlePageSubmit}
        handleWarningClick={mockedHandleWarningClick}
        submitBtnText={"Create Employee"}
        warningBtnText={"Cancel"}
      />,
    );
    // act
    const errorMsg = screen.getByText(
      "Unable to fetch some form data. Please try refreshing the page.",
    );
    // assert
    expect(errorMsg).toBeInTheDocument();
  });

  it("Should render error message when form data has a fetching error and some form data is still pending", async () => {
    // arrange
    vi.mocked(useEmployeeFormOptions).mockReturnValue({
      formOptions: mockFormOptions,
      managerOptions: [
        { value: 1, label: "Sarah Jenkins (Senior Software Dev)" },
        { value: 2, label: "Alex Rivera (Software Dev)" },
      ],
      getUniqueOptions: mockGetUniqueOptions,
      getSelectedRoleId: vi.fn(),
      isLoading: true,
      hasError: true,
    });
    render(
      <EmployeeForm
        handlePageSubmit={mockedHandlePageSubmit}
        handleWarningClick={mockedHandleWarningClick}
        submitBtnText={"Create Employee"}
        warningBtnText={"Cancel"}
      />,
    );
    // act
    const errorMsg = screen.getByText(
      "Unable to fetch some form data. Please try refreshing the page.",
    );
    // assert
    expect(errorMsg).toBeInTheDocument();
    expect(screen.queryByText("Loading form details")).not.toBeInTheDocument();
  });

  it("Should render loading message when form data is pending", async () => {
    // arrange
    vi.mocked(useEmployeeFormOptions).mockReturnValue({
      formOptions: mockFormOptions,
      managerOptions: [
        { value: 1, label: "Sarah Jenkins (Senior Software Dev)" },
        { value: 2, label: "Alex Rivera (Software Dev)" },
      ],
      getUniqueOptions: mockGetUniqueOptions,
      getSelectedRoleId: vi.fn(),
      isLoading: true,
      hasError: false,
    });
    render(
      <EmployeeForm
        handlePageSubmit={mockedHandlePageSubmit}
        handleWarningClick={mockedHandleWarningClick}
        submitBtnText={"Create Employee"}
        warningBtnText={"Cancel"}
      />,
    );
    // act
    const loadingMsg = screen.getByText("Loading form details");
    // assert
    expect(loadingMsg).toBeInTheDocument();
  });

  it("Should render schema errors for when blank/null fields are submitted", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <EmployeeForm
        handlePageSubmit={mockedHandlePageSubmit}
        handleWarningClick={mockedHandleWarningClick}
        submitBtnText={"Create Employee"}
        warningBtnText={"Cancel"}
        hasEmail={false}
      />,
    );
    // act
    const submitBtn = screen.getByRole("button", { name: "Create Employee" });
    await user.click(submitBtn);
    expect(mockGetSelectedRoleId).not.toHaveBeenCalled();
    expect(mockedHandlePageSubmit).not.toHaveBeenCalled();
    // assert
    expect(
      await screen.findByText("First name cannot be empty"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Last name cannot be empty"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Must select pronoun choice"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "Phone number must be between 7 and 20 characters",
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Unit Number cannot be empty"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Street Address cannot be empty"),
    ).toBeInTheDocument();
    expect(await screen.findByText("City cannot be empty")).toBeInTheDocument();
    expect(
      await screen.findByText("Postal Code cannot be empty"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Must select level of seniority"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Must select a department"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Must select work setup"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Must select employment type"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Start date is required"),
    ).toBeInTheDocument();
  });

  it("Should render schema errors when invalid values are entered and submitted", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <EmployeeForm
        handlePageSubmit={mockedHandlePageSubmit}
        handleWarningClick={mockedHandleWarningClick}
        submitBtnText={"Create Employee"}
        warningBtnText={"Cancel"}
      />,
    );
    // act
    const submitBtn = screen.getByRole("button", { name: "Create Employee" });
    await user.type(screen.getByLabelText("Email Address *"), "sarah.jenkins");
    await user.type(
      screen.getByLabelText("Phone Number *"),
      "+6141234567891011121314",
    );
    await user.click(screen.getByRole("radio", { name: "Blank Employment" }));
    await user.click(screen.getByRole("radio", { name: "Blank Work Setup" }));
    await user.type(screen.getByLabelText("Start Date *"), "2026-03-15");
    await user.type(screen.getByLabelText("Last Date"), "2025-03-15");
    await user.click(submitBtn);
    // assert
    expect(mockGetSelectedRoleId).not.toHaveBeenCalled();
    expect(mockedHandlePageSubmit).not.toHaveBeenCalled();
    expect(
      await screen.findByText("Invalid email address"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "Phone number must be between 7 and 20 characters",
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Work setup cannot be empty"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Employment type cannot be empty"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Last date must be after start date"),
    ).toBeInTheDocument();
  });
});
