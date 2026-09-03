import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("Should render with button", () => {
    // arrange
    render(
      <MemoryRouter>
        <Header numEmployees={3} />
      </MemoryRouter>,
    );
    // act
    const heading = screen.getByRole("heading", { level: 1 });
    const para = screen.getByRole("paragraph");
    const btn = screen.getByRole("button");
    // assert
    expect(heading).toHaveTextContent("Team");
    expect(para).toHaveTextContent("3 active employees");
    expect(btn).toHaveTextContent("+ Add Employee");
  });

  it("Should render dynamic number of employees", () => {
    // arrange
    render(
      <MemoryRouter>
        <Header numEmployees={0} />
      </MemoryRouter>,
    );
    // act
    const para = screen.getByRole("paragraph");
    // assert
    expect(para).toHaveTextContent("0 active employees");
  });

  it("Should call navigate with correct link when button is clicked", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Header numEmployees={3} />
      </MemoryRouter>,
    );
    // act
    const btn = screen.getByRole("button");
    await user.click(btn);
    // assert
    expect(mockNavigate).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith("/create");
  });
});
