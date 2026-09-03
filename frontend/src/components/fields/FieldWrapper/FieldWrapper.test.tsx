import { render, screen } from "@testing-library/react";
import { FieldWrapper } from "./FieldWrapper";

describe("FieldWrapper", () => {
  it("Should render label, children and default values", () => {
    // arrange
    render(
      <FieldWrapper id="firstName" label="First Name">
        Enter First Name here
      </FieldWrapper>,
    );
    // act
    const label = screen.getByText("First Name");
    const child = screen.getByText("Enter First Name here");
    const wrapper = label.closest("div");
    // assert
    expect(label).toHaveAttribute("for", "firstName");
    expect(child).toBeInTheDocument();
    expect(wrapper).toHaveClass("col-span-2");
  });

  it("Should render updated prop values when provided", () => {
    // arrange
    render(
      <FieldWrapper label="First Name" colSpan="col-span-1" required={true}>
        Enter First Name here
      </FieldWrapper>,
    );
    // act
    const label = screen.getByText("First Name");
    const required = screen.getByText("*");
    const wrapper = label.closest("div");
    // assert
    expect(label).not.toHaveAttribute("for");
    expect(required).toBeInTheDocument();
    expect(wrapper).toHaveClass("col-span-1");
  });

  it("Should render error message when error is provided", () => {
    // arrange
    render(
      <FieldWrapper
        id="firstName"
        label="First Name"
        error="First name cannot be empty"
      >
        Enter First Name here
      </FieldWrapper>,
    );
    // act
    const errorMsg = screen.getByText("First name cannot be empty");
    // assert
    expect(errorMsg).toBeInTheDocument();
  });
});

// error
