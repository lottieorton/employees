import { useMemo } from "react";
import EmployeeList from "../../EmployeeList/EmployeeList";
import Header from "../../Header/Header";
import SearchBar from "../../SearchBar/SearchBar";
import { useEmployees } from "../../../hooks/useEmployees";
import {
  isSearchField,
  type SearchQuery,
} from "../../../interfaces/SearchQuery";
import { useSearchParams } from "react-router-dom";
import type { Employees } from "../../../interfaces/Employee";

const defaultEmployeesResponse: Employees = {
  currentPage: 1,
  totalPages: 1,
  totalResults: 0,
  resultsPerPage: 10,
  nextPage: null,
  previousPage: null,
  data: [],
};

export default function Homepage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const searchBy = searchParams.get("searchBy") || "search";

  const searchQuery = useMemo(() => {
    const query: SearchQuery = {};
    if (searchTerm.trim() !== "" && isSearchField(searchBy)) {
      query[searchBy] = searchTerm;
    }
    return query;
  }, [searchTerm, searchBy]);

  const {
    data: employees = defaultEmployeesResponse,
    isLoading,
    isError,
  } = useEmployees(searchQuery);

  const handleSearchUpdate = (term: string, by: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      if (term.trim() !== "") {
        newParams.set("search", term);
      } else {
        newParams.delete("search");
      }

      if (by && by !== "search") {
        newParams.set("searchBy", by);
      } else {
        newParams.delete("searchBy");
      }
      return Object.fromEntries(newParams);
    });
  };

  return (
    <section className="w-full flex flex-col gap-5 3xl:gap-7">
      <Header numEmployees={employees.totalResults} />
      <SearchBar
        initialSearchValue={searchTerm}
        initialSearchByValue={searchBy}
        handleSearch={handleSearchUpdate}
      />
      <EmployeeList
        searchTerm={searchTerm}
        employees={employees.data}
        isLoading={isLoading}
        isError={isError}
      />
    </section>
  );
}
