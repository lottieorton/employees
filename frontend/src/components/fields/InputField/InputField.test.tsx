import { render, screen } from "@testing-library/react";
import type { UseFormRegisterReturn } from "react-hook-form";
import InputField from "./InputField";
import userEvent from "@testing-library/user-event";

describe("InputField", () => {
  const mockRegistration: UseFormRegisterReturn = {
    name: "firstName",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render input and FieldWrapper with inputted and default prop values and handle change", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <InputField
        id="firstName"
        label="First Name"
        registration={mockRegistration}
      />,
    );
    // act
    const label = screen.getByText("First Name");
    const input = screen.getByRole("textbox", { name: "First Name" });
    const wrapper = label.closest("div");
    await user.type(input, "Sarah");
    // assert
    expect(label).toHaveAttribute("for", "firstName");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Sarah");
    expect(input).toHaveAttribute("id", "firstName");
    expect(wrapper).toHaveClass("col-span-2");
    expect(mockRegistration.onChange).toHaveBeenCalledTimes(5);
  });

  it("Should render input and FieldWrapper with non-default inputted prop values", () => {
    // arrange
    render(
      <InputField
        id="age"
        label="Age"
        type="number"
        colSpan="col-span-1"
        required={true}
        registration={mockRegistration}
      />,
    );
    // act
    const label = screen.getByText("Age");
    const input = screen.getByRole("spinbutton", { name: "Age *" });
    const wrapper = label.closest("div");
    // assert
    expect(label).toHaveAttribute("for", "age");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "age");
    expect(wrapper).toHaveClass("col-span-1");
  });

  it("Should render input as disabled when disabled prop is true", async () => {
    // arrange
    const user = userEvent.setup();

    render(
      <InputField
        id="firstName"
        label="First Name"
        disabled={true}
        registration={mockRegistration}
      />,
    );
    // act
    const input = screen.getByRole("textbox", { name: "First Name" });
    await user.type(input, "Sarah");
    // assert
    expect(input).toHaveAttribute("disabled");
    expect(input).toHaveValue("");
  });

  it("Should render error message when error prop received", () => {
    // arrange
    render(
      <InputField
        id="firstName"
        label="First Name"
        error="First Name cannot be empty"
        registration={mockRegistration}
      />,
    );
    // act
    const errorMsg = screen.getByText("First Name cannot be empty");
    // assert
    expect(errorMsg).toBeInTheDocument();
  });
});
