import EmployeeCard from "../EmployeeCard/EmployeeCard";
import { useEmployees } from "../../hooks/useEmployees";
import type { SearchQuery } from "../../interfaces/SearchQuery";
import ErrorBanner from "../ErrorBanner/ErrorBanner";
import LoadingBanner from "../LoadingBanner/LoadingBanner";

interface EmployeeListProps {
  searchTerm: string;
  searchBy: string;
}

export default function EmployeeList({
  searchTerm,
  searchBy,
}: EmployeeListProps) {
  const searchQuery: SearchQuery = {};

  if (searchTerm.trim() !== "") {
    searchQuery[searchBy] = searchTerm;
    console.log(searchQuery);
  }
  const {
    data: employees = [],
    isLoading,
    isError,
  } = useEmployees(searchQuery);

  if (isError) {
    return (
      <ErrorBanner>
        Failed to load employees. Please try refreshing the page.
      </ErrorBanner>
    );
  }

  if (isLoading) {
    return <LoadingBanner>Loading employees...</LoadingBanner>;
  }

  if (employees.length === 0) {
    return (
      <ErrorBanner>
        {searchTerm.trim() !== ""
          ? "Oops there are no employees for this search. Please update it."
          : "No employees exist. Begin creating some now."}
      </ErrorBanner>
    );
  }

  return (
    <section className="">
      {employees.map((emp, index) => {
        return (
          <div key={emp.id}>
            <EmployeeCard
              employee={emp}
              bgColor={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            />
          </div>
        );
      })}
    </section>
  );
}
