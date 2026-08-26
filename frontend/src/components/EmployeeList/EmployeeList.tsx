import EmployeeCard from "../EmployeeCard/EmployeeCard";
import { useEmployees } from "../../hooks/useEmployees";
import type { SearchQuery } from "../../interfaces/SearchQuery";

interface EmployeeListProps {
  searchTerm: string;
}

export default function EmployeeList({ searchTerm }: EmployeeListProps) {
  const searchQuery: SearchQuery = {};

  if (searchTerm.trim() !== "") {
    searchQuery.search = searchTerm;
  }
  const {
    data: employees = [],
    isLoading,
    isError,
  } = useEmployees(searchQuery);

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
