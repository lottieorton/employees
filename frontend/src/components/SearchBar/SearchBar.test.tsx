import { fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "./SearchBar";
import userEvent from "@testing-library/user-event";

describe("SearchBar", () => {
  const mockHandleSearch = vi.fn();
  const mockHandleSearchBy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should render", () => {
    // arrange
    render(
      <SearchBar
        handleSearch={mockHandleSearch}
        handleSearchBy={mockHandleSearchBy}
      />,
    );
    // act
    const searchIcon = screen.getByLabelText("Search icon");
    const searchBar = screen.getByRole("textbox");
    const searchByDropdown = screen.getByRole("combobox");
    const dropdownOptions = screen.getAllByRole("option");
    // assert
    expect(searchIcon).toBeInTheDocument();
    expect(searchBar).toHaveTextContent("");
    expect(searchBar).toHaveValue("");
    expect(searchBar).toHaveAttribute(
      "placeholder",
      "Search by name, role, etc",
    );
    expect(searchByDropdown).toHaveValue("search");
    expect(dropdownOptions).toHaveLength(5);
    expect(dropdownOptions[0]).toHaveTextContent("Search by...");
    expect(dropdownOptions[0]).toHaveValue("search");
    expect(dropdownOptions[1]).toHaveTextContent("First Name");
    expect(dropdownOptions[1]).toHaveValue("firstName");
  });

  it("Should update the input on change", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <SearchBar
        handleSearch={mockHandleSearch}
        handleSearchBy={mockHandleSearchBy}
      />,
    );
    // act
    const searchBar = screen.getByRole("textbox");
    await user.type(searchBar, "Hello");
    // assert
    expect(searchBar).toHaveValue("Hello");
  });

  it("Should update the selected searchby on change", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <SearchBar
        handleSearch={mockHandleSearch}
        handleSearchBy={mockHandleSearchBy}
      />,
    );
    // act
    const searchByDropdown = screen.getByRole("combobox");
    await user.selectOptions(searchByDropdown, "First Name");
    // assert
    expect(searchByDropdown).toHaveValue("firstName");
  });

  it("Should set a timer to call handle search and searchby on input change", async () => {
    // arrange
    vi.useFakeTimers();
    render(
      <SearchBar
        handleSearch={mockHandleSearch}
        handleSearchBy={mockHandleSearchBy}
      />,
    );
    // act
    const searchBar = screen.getByRole("textbox");
    fireEvent.change(searchBar, { target: { value: "Hello" } });
    // assert
    expect(searchBar).toHaveValue("Hello");
    expect(mockHandleSearch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(mockHandleSearch).toHaveBeenCalledOnce();
    expect(mockHandleSearch).toHaveBeenCalledWith("Hello");
    expect(mockHandleSearchBy).toHaveBeenCalledOnce();
    expect(mockHandleSearchBy).toHaveBeenCalledWith("search");
  });

  it("Should set a timer to call handle search and searchby on selected search by change", async () => {
    // arrange
    vi.useFakeTimers();
    render(
      <SearchBar
        handleSearch={mockHandleSearch}
        handleSearchBy={mockHandleSearchBy}
      />,
    );
    // act
    const searchByDropdown = screen.getByRole("combobox");
    fireEvent.change(searchByDropdown, { target: { value: "firstName" } });
    // assert
    expect(searchByDropdown).toHaveValue("firstName");
    expect(mockHandleSearch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(mockHandleSearch).toHaveBeenCalledOnce();
    expect(mockHandleSearch).toHaveBeenCalledWith("");
    expect(mockHandleSearchBy).toHaveBeenCalledOnce();
    expect(mockHandleSearchBy).toHaveBeenCalledWith("firstName");
  });

  it("Should reset a timer when additional actions are taken within the timer window", async () => {
    // arrange
    vi.useFakeTimers();
    render(
      <SearchBar
        handleSearch={mockHandleSearch}
        handleSearchBy={mockHandleSearchBy}
      />,
    );
    // act
    const searchByDropdown = screen.getByRole("combobox");
    const searchBar = screen.getByRole("textbox");
    fireEvent.change(searchByDropdown, { target: { value: "firstName" } });
    vi.advanceTimersByTime(300);
    expect(mockHandleSearch).not.toHaveBeenCalled();
    fireEvent.change(searchBar, { target: { value: "Hello" } });
    vi.advanceTimersByTime(300);
    expect(mockHandleSearch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    // assert
    expect(searchBar).toHaveValue("Hello");
    expect(searchByDropdown).toHaveValue("firstName");
    expect(mockHandleSearch).toHaveBeenCalledOnce();
    expect(mockHandleSearch).toHaveBeenCalledWith("Hello");
    expect(mockHandleSearchBy).toHaveBeenCalledOnce();
    expect(mockHandleSearchBy).toHaveBeenCalledWith("firstName");
  });

  it("Should set multiple timers when additional actions are taken after previous events have resolved", async () => {
    // arrange
    vi.useFakeTimers();
    render(
      <SearchBar
        handleSearch={mockHandleSearch}
        handleSearchBy={mockHandleSearchBy}
      />,
    );
    // act
    const searchByDropdown = screen.getByRole("combobox");
    fireEvent.change(searchByDropdown, { target: { value: "firstName" } });
    vi.advanceTimersByTime(500);
    expect(searchByDropdown).toHaveValue("firstName");
    expect(mockHandleSearchBy).toHaveBeenCalledOnce();
    fireEvent.change(searchByDropdown, { target: { value: "lastName" } });
    vi.advanceTimersByTime(500);
    // assert
    expect(searchByDropdown).toHaveValue("lastName");
    expect(mockHandleSearch).toHaveBeenCalledTimes(2);
    expect(mockHandleSearchBy).toHaveBeenCalledTimes(2);
    expect(mockHandleSearch).toHaveBeenNthCalledWith(1, "");
    expect(mockHandleSearch).toHaveBeenNthCalledWith(2, "");
    expect(mockHandleSearchBy).toHaveBeenNthCalledWith(1, "firstName");
    expect(mockHandleSearchBy).toHaveBeenNthCalledWith(2, "lastName");
  });
});
