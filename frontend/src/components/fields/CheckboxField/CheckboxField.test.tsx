import { render, screen } from "@testing-library/react";
import CheckboxField from "./CheckboxField";
import type { UseFormRegisterReturn } from "react-hook-form";
import userEvent from "@testing-library/user-event";

describe("CheckboxField", () => {
  const mockRegistration: UseFormRegisterReturn = {
    name: "isCurrentlyEmployed",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render with prop values received and handles changes", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <CheckboxField
        id="isCurrentlyEmployed"
        label="Current Employee"
        registration={mockRegistration}
      />,
    );
    // act
    const checkbox = screen.getByRole("checkbox", { name: "Current Employee" });
    const wrapper = checkbox.closest("div");
    await user.click(checkbox);
    //   assert
    expect(checkbox).toHaveAttribute("name", "isCurrentlyEmployed");
    expect(wrapper).toHaveClass("col-span-2");
    expect(mockRegistration.onChange).toHaveBeenCalledOnce();
  });

  it("Should render error message if provided", async () => {
    // arrange
    render(
      <CheckboxField
        id="isCurrentlyEmployed"
        label="Current Employee"
        error="Must select if employee is active"
        registration={mockRegistration}
      />,
    );
    // act
    const errorMsg = screen.getByText("Must select if employee is active");
    //   assert
    expect(errorMsg).toBeInTheDocument();
  });

  it("Should render updated column span if provided", async () => {
    // arrange
    render(
      <CheckboxField
        id="isCurrentlyEmployed"
        label="Current Employee"
        colSpan="col-span-1"
        registration={mockRegistration}
      />,
    );
    // act
    const wrapper = screen
      .getByRole("checkbox", { name: "Current Employee" })
      .closest("div");
    //   assert
    expect(wrapper).toHaveClass("col-span-1");
  });
});
