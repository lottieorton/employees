import EmployeeCard from "../EmployeeCard/EmployeeCard";
import ErrorBanner from "../ErrorBanner/ErrorBanner";
import LoadingBanner from "../LoadingBanner/LoadingBanner";
import type { Employee } from "../../interfaces/Employee";
import Modal from "../Modal/Modal";
import { useState } from "react";
import { useDeleteEmployee } from "../../hooks/useEmployees";
import { toast } from "react-toastify";

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
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const { mutate: deleteEmployee, isPending: isDeletePending } =
    useDeleteEmployee();

  const handleClick = () => {
    if (selectedEmployee === null) return;
    deleteEmployee(
      { id: selectedEmployee.id, addressId: selectedEmployee.address?.id },
      {
        onSuccess: () => {
          setSelectedEmployee(null);
        },
        onError: (err) => {
          const errorMsg =
            err.message ===
            "Cannot delete this employee as they are currently a manager of other employee(s)"
              ? err.message
              : "Oops, something went wrong when deleting this employee.";

          toast.error(errorMsg);
        },
      },
    );
  };

  const openModal = (e: Employee) => {
    setSelectedEmployee(e);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

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
              openModal={openModal}
            />
          </div>
        );
      })}
      {selectedEmployee && (
        <Modal
          firstName={selectedEmployee.firstName}
          lastName={selectedEmployee.lastName}
          role={`${selectedEmployee.role?.name} - ${selectedEmployee.role?.department}`}
          handleClick={handleClick}
          closeModal={closeModal}
          actionText={isDeletePending ? "Deleting..." : "Delete"}
        />
      )}
    </section>
  );
}
