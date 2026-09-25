import { render, screen } from "@testing-library/react";
import Modal from "./Modal";
import userEvent from "@testing-library/user-event";

describe("Modal", () => {
  const mockHandleClick = vi.fn();
  const mockCloseModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should render with prop data", () => {
    // arrange
    render(
      <Modal
        firstName="Sarah"
        lastName="Jenkins"
        role="Software Engineer - Engineering"
        handleClick={mockHandleClick}
        closeModal={mockCloseModal}
        actionText="Delete"
      />,
    );
    // act
    const heading = screen.getByRole("heading", { level: 2 });
    const question = screen.getByText("Are you sure you want to delete?");
    const name = screen.getByText("Sarah Jenkins");
    const role = screen.getByText("Software Engineer - Engineering");
    const warningMsg = screen.getByText("This action cannot be undone.");
    const actionBtn = screen.getByRole("button", { name: "Delete" });
    // assert
    expect(heading).toHaveTextContent("Remove employee?");
    expect(question).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(role).toBeInTheDocument();
    expect(warningMsg).toBeInTheDocument();
    expect(actionBtn).toBeInTheDocument();
  });

  it("Should call closeModal on clicking Cancel button", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <Modal
        firstName="Sarah"
        lastName="Jenkins"
        role="Software Engineer - Engineering"
        handleClick={mockHandleClick}
        closeModal={mockCloseModal}
        actionText="Delete"
      />,
    );
    // act
    expect(mockCloseModal).not.toHaveBeenCalled();
    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelBtn);
    // assert
    expect(mockCloseModal).toHaveBeenCalledOnce();
  });

  it("Should call closeModal on clicking X button", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <Modal
        firstName="Sarah"
        lastName="Jenkins"
        role="Software Engineer - Engineering"
        handleClick={mockHandleClick}
        closeModal={mockCloseModal}
        actionText="Delete"
      />,
    );
    // act
    expect(mockCloseModal).not.toHaveBeenCalled();
    const closeBtn = screen.getByLabelText("Close modal");
    await user.click(closeBtn);
    // assert
    expect(mockCloseModal).toHaveBeenCalledOnce();
  });

  it("Should call closeModal on clicking outside the modal", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <Modal
        firstName="Sarah"
        lastName="Jenkins"
        role="Software Engineer - Engineering"
        handleClick={mockHandleClick}
        closeModal={mockCloseModal}
        actionText="Delete"
      />,
    );
    // act
    expect(mockCloseModal).not.toHaveBeenCalled();
    const outsideModal = screen.getByTestId("outer-section");
    await user.click(outsideModal);
    // assert
    expect(mockCloseModal).toHaveBeenCalledOnce();
  });

  it("Should call handleClick on clicking action button", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <Modal
        firstName="Sarah"
        lastName="Jenkins"
        role="Software Engineer - Engineering"
        handleClick={mockHandleClick}
        closeModal={mockCloseModal}
        actionText="Delete"
      />,
    );
    // act
    expect(mockHandleClick).not.toHaveBeenCalled();
    const actionBtn = screen.getByRole("button", { name: "Delete" });
    await user.click(actionBtn);
    // assert
    expect(mockHandleClick).toHaveBeenCalledOnce();
  });
});
