import { render, screen } from "@testing-library/react";
import Button from "./Button";
import userEvent from "@testing-library/user-event";

describe("Button", () => {
  it("Should render child text and default styling", () => {
    // arrange
    render(<Button>Click me</Button>);
    // act
    const btn = screen.getByRole("button");
    // assert
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("Click me");
    // primary classes
    expect(btn).toHaveClass("bg-indigo-600");
    expect(btn).toHaveClass("text-white");
    // small classes
    expect(btn).toHaveClass("text-sm");
  });

  it("Should render styling based on props", () => {
    // arrange
    render(
      <Button size="lg" type="danger">
        Click me
      </Button>,
    );
    // act
    const btn = screen.getByRole("button");
    // assert
    // danger classes
    expect(btn).toHaveClass("bg-rose-100");
    expect(btn).toHaveClass("text-red-500");
    // large classes
    expect(btn).toHaveClass("text-base");
  });

  it("Should call handleClick prop when clicked", async () => {
    // arrange
    const mockHandleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button handleClick={mockHandleClick}>Click me</Button>);
    // act
    const btn = screen.getByRole("button");
    await user.click(btn);
    // assert
    expect(mockHandleClick).toHaveBeenCalledOnce();
  });
});
