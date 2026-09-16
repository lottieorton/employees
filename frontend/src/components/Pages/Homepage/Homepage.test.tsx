import { render, screen, waitFor } from "@testing-library/react";
import { useEmployees } from "../../../hooks/useEmployees";
import type { Employee } from "../../../interfaces/Employee";
import Homepage from "./Homepage";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation } from "react-router-dom";

vi.mock("../../../hooks/useEmployees", () => ({
  useEmployees: vi.fn(),
}));

vi.mock("../../Header/Header", () => ({
  default: ({ numEmployees }: { numEmployees: number }) => {
    return <div data-testid="mock-header">{`${numEmployees} employees`}</div>;
  },
}));

vi.mock("../../EmployeeList/EmployeeList", () => ({
  default: ({
    searchTerm,
    employees,
    isError,
    isLoading,
  }: {
    searchTerm: string;
    employees: Employee[];
    isError: boolean;
    isLoading: boolean;
  }) => {
    return (
      <div data-testid="mock-employee-list">
        <p>{`Search term: ${searchTerm}`}</p>
        <p>{`Loading: ${isLoading}`}</p>
        <p>{`Error: ${isError}`}</p>
        {employees.map((e) => {
          return (
            <div
              data-testid="mock-employee"
              key={e.id}
            >{`${e.id}: ${e.firstName}`}</div>
          );
        })}
      </div>
    );
  },
}));

vi.mock("../../SearchBar/SearchBar", () => ({
  default: ({
    initialSearchValue,
    initialSearchByValue,
    handleSearch,
  }: {
    initialSearchValue: string;
    initialSearchByValue: string;
    handleSearch: (term: string, by: string) => void;
  }) => (
    <div data-testid="mock-searchbar">
      <p>Initial search value: {initialSearchValue}</p>
      <p>Initial searchBy: {initialSearchByValue}</p>
      <button
        data-testid="empty-search"
        onClick={() => {
          handleSearch("", "");
        }}
      >
        Search all
      </button>
      <button
        data-testid="general-searchBy"
        onClick={() => {
          handleSearch("Sarah", "search");
        }}
      >
        General Search Sarah
      </button>
      <button
        data-testid="name-searchBy"
        onClick={() => {
          handleSearch("Alex", "firstName");
        }}
      >
        Search Alex name
      </button>
      <button
        data-testid="invalid-searchBy"
        onClick={() => {
          handleSearch("Alex", "invalid");
        }}
      >
        Invalid searchby
      </button>
    </div>
  ),
}));

vi.mock("../../Pagination/Pagination", () => ({
  default: ({
    pagination,
    handlePageChange,
  }: {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalResults: number;
      resultsPerPage: number;
      nextPage: number | null;
      previousPage: number | null;
    };
    handlePageChange: (newPage: string) => void;
  }) => (
    <div data-testid="mock-pagination">
      <p>{`Current Page: ${pagination.currentPage}`}</p>
      <p>{`Total Results: ${pagination.totalResults}`}</p>
      <button
        data-testid="next-page-btn"
        onClick={() => {
          if (pagination.nextPage !== null) {
            handlePageChange(pagination.nextPage.toString());
          }
        }}
      >
        Next Page
      </button>
      <button
        data-testid="invalid-page-btn"
        onClick={() => {
          handlePageChange("invalid");
        }}
      >
        Invalid Page
      </button>
    </div>
  ),
}));

describe("Homepage", () => {
  const employees = [
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Jenkins",
      middleName: "Marie",
      preferredName: "SJ",
      pronouns: "She/Her",
      emailAddress: "sarah.jenkins@example.com",
      phoneNumber: "+61412345678",
      address: {
        id: 4,
        unitNumber: "30",
        streetAddress: "Park Lane",
        addressLine2: "Leicester Square",
        city: "London",
        stateProvinceRegion: "Mayfair",
        postalCode: "E1 1GB",
        country: "England",
      },
      role: {
        id: 1,
        name: "Software Developer",
        seniorityLevel: "Junior",
        department: "Engineering",
      },
      manager: null,
      workSetup: "Onsite",
      employmentType: "Full-Time Permanent",
      startDate: "2021-03-15",
      lastDate: null,
      isCurrentlyEmployed: true,
    },
    {
      id: 2,
      firstName: "Alex",
      lastName: "Rivera",
      middleName: null,
      preferredName: "Al",
      pronouns: "He/Him",
      emailAddress: "alex.rivera@example.com",
      phoneNumber: "+61498765432",
      address: {
        id: 5,
        unitNumber: "86",
        streetAddress: "Wallaby Way",
        addressLine2: "Opera House View Parade",
        city: "Sydney",
        stateProvinceRegion: "Darling Harbour",
        postalCode: "2000",
        country: "Australia",
      },
      role: {
        id: 2,
        name: "Software Developer",
        seniorityLevel: "Mid",
        department: "Engineering",
      },
      manager: {
        id: 4,
        fullName: "Sarah Jenkins",
        role: "Software Developer",
      },
      workSetup: "Hybrid",
      employmentType: "Full-Time Permanent",
      startDate: "2023-08-01",
      lastDate: null,
      isCurrentlyEmployed: true,
    },
  ];

  function LocationDisplay() {
    const location = useLocation();
    return <div data-testid="location-display">{location.search}</div>;
  }

  const employeesResponse = {
    currentPage: 1,
    totalPages: 1,
    totalResults: 2,
    resultsPerPage: 10,
    nextPage: null,
    previousPage: null,
    data: employees,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useEmployees).mockReturnValue({
      data: employeesResponse,
      isLoading: false,
      isError: false,
    } as any);
  });

  it("Should pass props to children components when a list of employees is returned", () => {
    // arrange
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>,
    );
    // act
    const header = screen.getByTestId("mock-header");
    const searchTerm = screen.getByText("Search term:");
    const loading = screen.getByText("Loading: false");
    const error = screen.getByText("Error: false");
    const employees = screen.getAllByTestId("mock-employee");
    const searchBarInitialTerm = screen.getByText("Initial search value:");
    const searchBarInitialSearchBy = screen.getByText(
      "Initial searchBy: search",
    );
    const paginationCurrentPage = screen.getByText("Current Page: 1");
    const paginationTotalResults = screen.getByText("Total Results: 2");
    // assert
    expect(header).toHaveTextContent("2 employees");
    expect(searchTerm).toBeInTheDocument();
    expect(loading).toBeInTheDocument();
    expect(error).toBeInTheDocument();
    expect(employees).toHaveLength(2);
    expect(employees[0]).toHaveTextContent("1: Sarah");
    expect(employees[1]).toHaveTextContent("2: Alex");
    expect(searchBarInitialTerm).toBeInTheDocument();
    expect(searchBarInitialSearchBy).toBeInTheDocument();
    expect(paginationCurrentPage).toBeInTheDocument();
    expect(paginationTotalResults).toBeInTheDocument();
  });

  it("Should pass error to children components when there is an error fetching employees", () => {
    // arrange
    const emptyEmployeesResponse = {
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
      resultsPerPage: 0,
      nextPage: null,
      previousPage: null,
      data: [],
    };
    vi.mocked(useEmployees).mockReturnValue({
      data: emptyEmployeesResponse,
      isLoading: false,
      isError: true,
    } as any);
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>,
    );
    // act
    const error = screen.getByText("Error: true");
    // assert
    expect(error).toBeInTheDocument();
  });

  it("Should pass loading status to children components when fetching employees", () => {
    // arrange
    const emptyEmployeesResponse = {
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
      resultsPerPage: 0,
      nextPage: null,
      previousPage: null,
      data: [],
    };
    vi.mocked(useEmployees).mockReturnValue({
      data: emptyEmployeesResponse,
      isLoading: true,
      isError: false,
    } as any);
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>,
    );
    // act
    const loading = screen.getByText("Loading: true");
    const header = screen.getByTestId("mock-header");
    // assert
    expect(loading).toBeInTheDocument();
    expect(header).toHaveTextContent("0 employees");
  });

  it("Should pass empty employees to children components when no employees received", () => {
    // arrange
    const emptyEmployeesResponse = {
      currentPage: 1,
      totalPages: 1,
      totalResults: 0,
      resultsPerPage: 0,
      nextPage: null,
      previousPage: null,
      data: [],
    };
    vi.mocked(useEmployees).mockReturnValue({
      data: emptyEmployeesResponse,
      isLoading: false,
      isError: false,
    } as any);
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>,
    );
    // act
    const employees = screen.queryAllByTestId("mock-employee");
    // assert
    expect(employees).toHaveLength(0);
  });

  it("Should call useEmployees on render", () => {
    // arrange
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>,
    );
    // assert
    expect(useEmployees).toHaveBeenCalledTimes(1);
    expect(useEmployees).toHaveBeenCalledWith({ page: 1 });
  });

  it("Should call useEmployees with a non-blank search query object when there is a search term", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>,
    );
    //act
    const searchBtn = screen.getByTestId("general-searchBy");
    await user.click(searchBtn);
    // assert
    await waitFor(() => {
      expect(useEmployees).toHaveBeenCalledTimes(2);
      expect(useEmployees).toHaveBeenCalledWith(
        expect.objectContaining({
          search: "Sarah",
        }),
      );
    });
  });

  it("Should pass the memoized query object reference on re-render with same search query values", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>,
    );
    //act
    const searchBtn = screen.getByTestId("general-searchBy");
    await user.click(searchBtn);
    await user.click(searchBtn);
    const firstClickQuery = vi.mocked(useEmployees).mock.calls[1][0];
    const secondClickQuery = vi.mocked(useEmployees).mock.calls[2][0];
    // assert
    expect(useEmployees).toHaveBeenCalledTimes(3);
    expect(firstClickQuery).toBe(secondClickQuery);
  });

  it("Should retrigger a search when re-rendered with different search query values", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>,
    );
    //act
    const searchBtn = screen.getByTestId("general-searchBy");
    const emptysearchBtn = screen.getByTestId("empty-search");
    await user.click(searchBtn);
    await user.click(emptysearchBtn);
    const firstClickQuery = vi.mocked(useEmployees).mock.calls[1][0];
    const secondClickQuery = vi.mocked(useEmployees).mock.calls[2][0];
    // assert
    expect(useEmployees).toHaveBeenCalledTimes(3);
    expect(firstClickQuery).not.toBe(secondClickQuery);
    expect(secondClickQuery).toEqual({ page: 1 });
  });

  it("Should call useEmployees without search query values when an invalid searchBy value is provided", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>,
    );
    //act
    const searchBtn = screen.getByTestId("invalid-searchBy");
    await user.click(searchBtn);
    // assert
    await waitFor(() => {
      expect(useEmployees).toHaveBeenCalledTimes(2);
      expect(useEmployees).toHaveBeenLastCalledWith({ page: 1 });
    });
  });

  it("Should call useEmployees with an updated page number when handlePage is called", async () => {
    // arrange
    const employeesResponse = {
      currentPage: 1,
      totalPages: 2,
      totalResults: 20,
      resultsPerPage: 10,
      nextPage: 2,
      previousPage: null,
      data: employees,
    };

    vi.mocked(useEmployees).mockReturnValue({
      data: employeesResponse,
      isLoading: false,
      isError: false,
    } as any);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>,
    );
    //act
    const nextPageBtn = screen.getByTestId("next-page-btn");
    await user.click(nextPageBtn);
    // assert
    await waitFor(() => {
      expect(useEmployees).toHaveBeenCalledTimes(2);
      expect(useEmployees).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          page: 1,
        }),
      );
      expect(useEmployees).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          page: 2,
        }),
      );
    });
  });

  it("Should call useEmployees with 1 when an invalid page number is provided", async () => {
    // arrange
    const employeesResponse = {
      currentPage: 1,
      totalPages: 2,
      totalResults: 20,
      resultsPerPage: 10,
      nextPage: 2,
      previousPage: null,
      data: employees,
    };

    vi.mocked(useEmployees).mockReturnValue({
      data: employeesResponse,
      isLoading: false,
      isError: false,
    } as any);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Homepage />
        <LocationDisplay />
      </MemoryRouter>,
    );
    //act
    const invalidPageBtn = screen.getByTestId("invalid-page-btn");
    const locationDisplay = screen.getByTestId("location-display");
    await user.click(invalidPageBtn);
    // assert
    await waitFor(() => {
      expect(useEmployees).toHaveBeenCalledTimes(2);
      expect(useEmployees).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          page: 1,
        }),
      );
      expect(locationDisplay).toHaveTextContent("?page=invalid");
      expect(useEmployees).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          page: 1,
        }),
      );
    });
  });

  it("Should clear page in query when search value changes", async () => {
    // arrange
    const employeesResponse = {
      currentPage: 1,
      totalPages: 2,
      totalResults: 20,
      resultsPerPage: 10,
      nextPage: 2,
      previousPage: null,
      data: employees,
    };

    vi.mocked(useEmployees).mockReturnValue({
      data: employeesResponse,
      isLoading: false,
      isError: false,
    } as any);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Homepage />
      </MemoryRouter>,
    );
    //act
    const nextPageBtn = screen.getByTestId("next-page-btn");
    const searchBtn = screen.getByTestId("general-searchBy");
    await user.click(nextPageBtn);
    await user.click(searchBtn);
    // assert
    await waitFor(() => {
      expect(useEmployees).toHaveBeenCalledTimes(3);
      expect(useEmployees).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          page: 1,
        }),
      );
      expect(useEmployees).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          page: 2,
        }),
      );
      expect(useEmployees).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          page: 1,
          search: "Sarah",
        }),
      );
    });
  });

  it("Should update the URL with a search term parameter when a search term is provided", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Homepage />
        <LocationDisplay />
      </MemoryRouter>,
    );
    //act
    const searchBtn = screen.getByTestId("general-searchBy");
    await user.click(searchBtn);
    // assert
    await waitFor(() => {
      expect(useEmployees).toHaveBeenCalledTimes(2);
      const locationDisplay = screen.getByTestId("location-display");
      expect(locationDisplay).toHaveTextContent("?search=Sarah");
    });
  });

  it("Should update the URL with both search term and search by parameters when both are provided", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Homepage />
        <LocationDisplay />
      </MemoryRouter>,
    );
    //act
    const searchBtn = screen.getByTestId("name-searchBy");
    await user.click(searchBtn);
    // assert
    await waitFor(() => {
      expect(useEmployees).toHaveBeenCalledTimes(2);
      const locationDisplay = screen.getByTestId("location-display");
      expect(locationDisplay).toHaveTextContent(
        "?search=Alex&searchBy=firstName",
      );
    });
  });

  it("Should update the URL with an updated page number when handlePage is called", async () => {
    // arrange
    const employeesResponse = {
      currentPage: 1,
      totalPages: 2,
      totalResults: 20,
      resultsPerPage: 10,
      nextPage: 2,
      previousPage: null,
      data: employees,
    };

    vi.mocked(useEmployees).mockReturnValue({
      data: employeesResponse,
      isLoading: false,
      isError: false,
    } as any);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Homepage />
        <LocationDisplay />
      </MemoryRouter>,
    );
    //act
    const nextPageBtn = screen.getByTestId("next-page-btn");
    const locationDisplay = screen.getByTestId("location-display");
    expect(locationDisplay).toHaveTextContent("");
    await user.click(nextPageBtn);
    // assert
    expect(locationDisplay).toHaveTextContent("?page=2");
  });

  it("Should update the URL with new search parameters on multiple searches", async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Homepage />
        <LocationDisplay />
      </MemoryRouter>,
    );
    //act
    const searchBtn = screen.getByTestId("general-searchBy");
    const emptysearchBtn = screen.getByTestId("empty-search");
    const locationDisplay = screen.getByTestId("location-display");
    await user.click(searchBtn);
    expect(locationDisplay).toHaveTextContent("?search=Sarah");
    await user.click(emptysearchBtn);
    expect(locationDisplay).toHaveTextContent("");
  });

  it("Should clear page parameter in URL when search value changes", async () => {
    // arrange
    const employeesResponse = {
      currentPage: 1,
      totalPages: 2,
      totalResults: 20,
      resultsPerPage: 10,
      nextPage: 2,
      previousPage: null,
      data: employees,
    };

    vi.mocked(useEmployees).mockReturnValue({
      data: employeesResponse,
      isLoading: false,
      isError: false,
    } as any);

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Homepage />
        <LocationDisplay />
      </MemoryRouter>,
    );
    //act
    const nextPageBtn = screen.getByTestId("next-page-btn");
    const searchBtn = screen.getByTestId("general-searchBy");
    const locationDisplay = screen.getByTestId("location-display");
    await user.click(nextPageBtn);
    expect(locationDisplay).toHaveTextContent("?page=2");
    await user.click(searchBtn);
    // assert
    expect(locationDisplay).toHaveTextContent("?search=Sarah");
  });
});
