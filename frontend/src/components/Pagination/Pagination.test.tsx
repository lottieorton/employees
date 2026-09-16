import { render, screen } from "@testing-library/react";
import Pagination from "./Pagination";
import userEvent from "@testing-library/user-event";

describe("Pagination", () => {
  const mockHandlePageChange = vi.fn();

  const pagination = {
    currentPage: 1,
    totalPages: 1,
    totalResults: 10,
    resultsPerPage: 10,
    previousPage: null,
    nextPage: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Should render and pass props to child components", () => {
    // arrange
    render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // act
    const pageInfo = screen.getByRole("paragraph");
    const previousBtn = screen.getByRole("button", { name: "Previous" });
    const nextBtn = screen.getByRole("button", { name: "Next" });
    // assert
    expect(pageInfo).toHaveTextContent("Employees 1-10 of 10");
    expect(previousBtn).toHaveClass("text-indigo-600");
    expect(nextBtn).toHaveClass("text-indigo-600");
  });

  it("Should correctly calculate the page information", () => {
    // arrange
    const pagination = {
      currentPage: 2,
      totalPages: 5,
      totalResults: 23,
      resultsPerPage: 5,
      previousPage: 1,
      nextPage: 3,
    };
    render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // act
    const pageInfo = screen.getByRole("paragraph");
    // assert
    expect(pageInfo).toHaveTextContent("Employees 6-10 of 23");
  });

  it("Should use the total results value if the last page is not full", () => {
    // arrange
    const pagination = {
      currentPage: 5,
      totalPages: 5,
      totalResults: 23,
      resultsPerPage: 5,
      previousPage: 4,
      nextPage: null,
    };
    render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // act
    const pageInfo = screen.getByRole("paragraph");
    // assert
    expect(pageInfo).toHaveTextContent("Employees 21-23 of 23");
  });

  it("Should call handlePageChange when previousPage is not null and previous button is clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const pagination = {
      currentPage: 2,
      totalPages: 3,
      totalResults: 25,
      resultsPerPage: 10,
      previousPage: 1,
      nextPage: 3,
    };
    render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // act
    const previousBtn = screen.getByRole("button", { name: "Previous" });
    await user.click(previousBtn);
    // assert
    expect(mockHandlePageChange).toHaveBeenCalledOnce();
    expect(mockHandlePageChange).toHaveBeenCalledWith("1");
  });

  it("Should scroll to the top of the page when previousPage is not null and previous button is clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const scrollToSpy = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => {});
    const pagination = {
      currentPage: 2,
      totalPages: 3,
      totalResults: 25,
      resultsPerPage: 10,
      previousPage: 1,
      nextPage: 3,
    };
    render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // act
    const previousBtn = screen.getByRole("button", { name: "Previous" });
    await user.click(previousBtn);
    // assert
    expect(mockHandlePageChange).toHaveBeenCalledOnce();
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("Should not call handlePageChange when previousPage is null and previous button is clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const pagination = {
      currentPage: 1,
      totalPages: 3,
      totalResults: 25,
      resultsPerPage: 10,
      previousPage: null,
      nextPage: 2,
    };
    render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // act
    const previousBtn = screen.getByRole("button", { name: "Previous" });
    await user.click(previousBtn);
    // assert
    expect(mockHandlePageChange).not.toHaveBeenCalled();
  });

  it("Should call handlePageChange when nextPage is not null and next button is clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const pagination = {
      currentPage: 2,
      totalPages: 3,
      totalResults: 25,
      resultsPerPage: 10,
      previousPage: 1,
      nextPage: 3,
    };
    render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // act
    const nextBtn = screen.getByRole("button", { name: "Next" });
    await user.click(nextBtn);
    // assert
    expect(mockHandlePageChange).toHaveBeenCalledOnce();
    expect(mockHandlePageChange).toHaveBeenCalledWith("3");
  });

  it("Should scroll to the top of the page when nextPage is not null and next button is clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const scrollToSpy = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => {});
    const pagination = {
      currentPage: 2,
      totalPages: 3,
      totalResults: 25,
      resultsPerPage: 10,
      previousPage: 1,
      nextPage: 3,
    };
    render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // act
    const nextBtn = screen.getByRole("button", { name: "Next" });
    await user.click(nextBtn);
    // assert
    expect(mockHandlePageChange).toHaveBeenCalledOnce();
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
  it("Should not call handlePageChange when nextPage is null and next button is clicked", async () => {
    // arrange
    const user = userEvent.setup();
    const pagination = {
      currentPage: 3,
      totalPages: 3,
      totalResults: 25,
      resultsPerPage: 10,
      previousPage: 2,
      nextPage: null,
    };
    render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // act
    const nextBtn = screen.getByRole("button", { name: "Next" });
    await user.click(nextBtn);
    // assert
    expect(mockHandlePageChange).not.toHaveBeenCalled();
  });

  it("Should disable previous button when previousPage is null", async () => {
    // arrange
    const pagination = {
      currentPage: 1,
      totalPages: 3,
      totalResults: 25,
      resultsPerPage: 10,
      previousPage: null,
      nextPage: 2,
    };
    render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // act
    const previousBtn = screen.getByRole("button", { name: "Previous" });
    // assert
    expect(previousBtn).toBeDisabled();
  });

  it("Should disable next button when nextPage is null", async () => {
    // arrange
    const pagination = {
      currentPage: 3,
      totalPages: 3,
      totalResults: 25,
      resultsPerPage: 10,
      previousPage: 2,
      nextPage: null,
    };
    render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // act
    const nextBtn = screen.getByRole("button", { name: "Next" });
    // assert
    expect(nextBtn).toBeDisabled();
  });

  it("Should return nothing when totalResults is 0", async () => {
    // arrange
    const pagination = {
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
      resultsPerPage: 10,
      previousPage: null,
      nextPage: null,
    };
    const { container } = render(
      <Pagination
        pagination={pagination}
        handlePageChange={mockHandlePageChange}
      />,
    );
    // assert
    expect(container.firstChild).toBeNull();
  });
});
