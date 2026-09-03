import { render, screen } from "@testing-library/react";
import ErrorBanner from "./ErrorBanner";

describe("Error Banner", () => {
  it("Should render children", () => {
    // arrange
    render(<ErrorBanner>Error Message</ErrorBanner>);
    // act
    const errorMsg = screen.getByText("Error Message");
    const errorIcon = screen.getByLabelText("Warning icon");
    // assert
    expect(errorMsg).toBeInTheDocument();
    expect(errorIcon).toBeInTheDocument();
  });
});
