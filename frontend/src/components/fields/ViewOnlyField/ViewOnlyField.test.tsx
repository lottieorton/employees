import { render, screen } from "@testing-library/react";
import ViewOnlyField from "./ViewOnlyField";

describe("ViewOnlyField", () => {
  it("Should render field with default and supplied props", () => {
    // arrange
    render(<ViewOnlyField label="First Name" value="Sarah" />);
    // act
    const header = screen.getByRole("heading", { level: 4 });
    const value = screen.getByRole("paragraph");
    const wrapper = header.closest("div");
    // assert
    expect(header).toHaveTextContent("First Name");
    expect(value).toHaveTextContent("Sarah");
    expect(wrapper).toHaveClass("col-span-1");
  });

  it("Should render field with default text when no value provided", () => {
    // arrange
    render(<ViewOnlyField label="First Name" />);
    // act
    const value = screen.getByRole("paragraph");
    // assert
    expect(value).toHaveTextContent("—");
  });

  it("Should render field with default text when empty value provided", () => {
    // arrange
    render(<ViewOnlyField label="First Name" value="" />);
    // act
    const value = screen.getByRole("paragraph");
    // assert
    expect(value).toHaveTextContent("—");
  });

  it("Should pass provided colspan prop", () => {
    // arrange
    render(
      <ViewOnlyField label="First Name" value="Sarah" colSpan="col-span-2" />,
    );
    // act
    const header = screen.getByRole("heading", { level: 4 });
    const wrapper = header.closest("div");
    // assert
    expect(wrapper).toHaveClass("col-span-2");
  });
});
