import { render, screen } from "@testing-library/react";
import type { UseFormRegisterReturn } from "react-hook-form";
import userEvent from "@testing-library/user-event";
import RadioGroupField from "./RadioGroupField";

describe("RadioGroupField", () => {
  const mockOptions = [
    { label: "Onsite", value: "Onsite" },

    { label: "Hybrid", value: "Hybrid" },

    { label: "Remote", value: "Remote" },
  ];

  const mockRegistration: UseFormRegisterReturn = {
    name: "workSetup",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render radio buttons and FieldWrapper with inputted and default prop values and handle change", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <RadioGroupField
        id="workSetup"
        name="workSetup"
        label="Work Setup"
        options={mockOptions}
        registration={mockRegistration}
      />,
    );
    // act
    const label = screen.getByText("Work Setup");
    const onsiteBtn = screen.getByRole("radio", { name: "Onsite" });
    const hybridBtn = screen.getByRole("radio", { name: "Hybrid" });
    const remoteBtn = screen.getByRole("radio", { name: "Remote" });
    const fieldWrapperWrap = label.closest("div");
    const radioWrapper = onsiteBtn.closest("div");
    expect(onsiteBtn).not.toBeChecked();
    await user.click(onsiteBtn);
    // assert
    expect(label).toHaveAttribute("for", "workSetup");
    expect(onsiteBtn).toBeChecked();
    expect(hybridBtn).not.toBeChecked();
    expect(remoteBtn).not.toBeChecked();
    expect(radioWrapper).toHaveClass("flex-row");
    expect(fieldWrapperWrap).toHaveClass("col-span-2");
  });

  it("Should render with non-default prop values when provided", () => {
    // arrange
    render(
      <RadioGroupField
        id="workSetup"
        name="workSetup"
        label="Work Setup"
        options={mockOptions}
        direction="col"
        colSpan="col-span-1"
        required={true}
        registration={mockRegistration}
      />,
    );
    // act
    const label = screen.getByText("Work Setup");
    const required = screen.getByText("*");
    const onsiteBtn = screen.getByRole("radio", { name: "Onsite" });
    const fieldWrapperWrap = label.closest("div");
    const radioWrapper = onsiteBtn.closest("div");
    // assert
    expect(radioWrapper).toHaveClass("flex-col");
    expect(fieldWrapperWrap).toHaveClass("col-span-1");
    expect(required).toBeInTheDocument();
  });

  it("Should render no radio buttons when no options provided", () => {
    // arrange
    render(
      <RadioGroupField
        id="workSetup"
        name="workSetup"
        label="Work Setup"
        options={[]}
        registration={mockRegistration}
      />,
    );
    // act
    const radio = screen.queryAllByRole("radio");
    // assert
    expect(radio).toHaveLength(0);
  });

  it("Should render error message when error prop received", () => {
    // arrange
    render(
      <RadioGroupField
        id="workSetup"
        name="workSetup"
        label="Work Setup"
        options={mockOptions}
        error="Must select an option"
        registration={mockRegistration}
      />,
    );
    // act
    const errorMsg = screen.getByText("Must select an option");
    // assert
    expect(errorMsg).toBeInTheDocument();
  });
});
