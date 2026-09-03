import { render, screen } from "@testing-library/react";
import LoadingBanner from "./LoadingBanner";

describe("LoadingBanner", () => {
  it("Should render children", () => {
    // arrange
    render(<LoadingBanner>Loading Message</LoadingBanner>);
    // act
    const loadingMsg = screen.getByText("Loading Message");
    const loadingIcon = screen.getByLabelText("Loading icon");
    // assert
    expect(loadingMsg).toBeInTheDocument();
    expect(loadingIcon).toBeInTheDocument();
  });
});
