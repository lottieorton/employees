import type { UseFormRegisterReturn } from "react-hook-form";
import SelectField from "./SelectField";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("SelectField", () => {
  const mockOptions = [
    { label: "She/Her", value: "She/Her" },

    { label: "He/Him", value: "He/Him" },

    { label: "They/Them", value: "They/Them" },
  ];

  const mockRegistration: UseFormRegisterReturn = {
    name: "pronouns",
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ref: vi.fn(),
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render dropdown and FieldWrapper with inputted and default prop values and handle change", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <SelectField
        id="pronouns"
        label="Pronouns"
        options={mockOptions}
        registration={mockRegistration}
      />,
    );
    // act
    const label = screen.getByText("Pronouns");
    const dropdown = screen.getByRole("combobox", { name: "Pronouns" });
    const fieldWrapperWrap = label.closest("div");
    expect(dropdown).toHaveDisplayValue("Select pronouns");
    expect(dropdown).toHaveValue("");
    await user.selectOptions(dropdown, "She/Her");
    // assert
    expect(label).toHaveAttribute("for", "pronouns");
    expect(dropdown).toHaveLength(4);
    expect(dropdown).toHaveValue("She/Her");
    expect(fieldWrapperWrap).toHaveClass("col-span-2");
  });

  it("Should render with non-default prop values when received", () => {
    // arrange
    render(
      <SelectField
        id="pronouns"
        label="Pronouns"
        options={mockOptions}
        colSpan="col-span-1"
        required={true}
        registration={mockRegistration}
      />,
    );
    // act
    const label = screen.getByText("Pronouns");
    const dropdown = screen.getByRole("combobox", { name: "Pronouns *" });
    const fieldWrapperWrap = label.closest("div");
    // assert
    expect(dropdown).toBeInTheDocument();
    expect(fieldWrapperWrap).toHaveClass("col-span-1");
  });

  it("Should render dropdown with only placeholder option when none are passed", () => {
    // arrange
    render(
      <SelectField
        id="pronouns"
        label="Pronouns"
        options={[]}
        registration={mockRegistration}
      />,
    );
    // act
    const dropdown = screen.getByRole("combobox", { name: "Pronouns" });
    // assert
    expect(dropdown).toHaveDisplayValue("Select pronouns");
    expect(dropdown).toHaveValue("");
    expect(dropdown).toHaveLength(1);
  });

  it("Should render error message when an error is passed", () => {
    // arrange
    render(
      <SelectField
        id="pronouns"
        label="Pronouns"
        options={mockOptions}
        error="Must choose an option"
        registration={mockRegistration}
      />,
    );
    // act
    const erroMsg = screen.getByText("Must choose an option");
    // assert
    expect(erroMsg).toBeInTheDocument();
  });
});
