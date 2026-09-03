import EmployeeCard from "../EmployeeCard/EmployeeCard";
import ErrorBanner from "../ErrorBanner/ErrorBanner";
import LoadingBanner from "../LoadingBanner/LoadingBanner";
import type { Employee } from "../../interfaces/Employee";

interface EmployeeListProps {
  searchTerm: string;
  employees: Employee[];
  isError: boolean;
  isLoading: boolean;
}

export default function EmployeeList({
  searchTerm,
  employees,
  isError,
  isLoading,
}: EmployeeListProps) {
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
    <section>
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
