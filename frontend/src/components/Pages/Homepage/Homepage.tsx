import { useMemo, useState } from "react";
import EmployeeList from "../../EmployeeList/EmployeeList";
import Header from "../../Header/Header";
import SearchBar from "../../SearchBar/SearchBar";
import { useEmployees } from "../../../hooks/useEmployees";
import type { SearchQuery } from "../../../interfaces/SearchQuery";

export default function Homepage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("");

  const searchQuery = useMemo(() => {
    const query: SearchQuery = {};
    if (searchTerm.trim() !== "") {
      query[searchBy] = searchTerm;
    }
    return query;
  }, [searchTerm, searchBy]);

  const {
    data: employees = [],
    isLoading,
    isError,
  } = useEmployees(searchQuery);

  return (
    <section className="w-full flex flex-col gap-5 3xl:gap-7">
      <Header numEmployees={employees.length} />
      <SearchBar handleSearch={setSearchTerm} handleSearchBy={setSearchBy} />
      <EmployeeList
        searchTerm={searchTerm}
        employees={employees}
        isLoading={isLoading}
        isError={isError}
      />
    </section>
  );
}
