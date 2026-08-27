import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../../EmployeeForm/EmployeeForm";
import EmployeeDetails from "../../EmployeeDetails/EmployeeDetails";
import { useEmployee } from "../../../hooks/useEmployees";
import LoadingBanner from "../../LoadingBanner/LoadingBanner";
import ErrorBanner from "../../ErrorBanner/ErrorBanner";

export default function EmployeePage() {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: employee, isLoading, isError } = useEmployee(id);

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSubmit = () => {
    // update user
    toggleEditing();
  };

  const handleCancelClick = () => {
    // delete user
    navigate("/");
  };

  if (isLoading) {
    return <LoadingBanner>Loading employee details...</LoadingBanner>;
  }

  if (isError || !employee) {
    return (
      <ErrorBanner>
        Failed to load employee details. Please try refreshing the page.
      </ErrorBanner>
    );
  }

  const fullName = [
    employee.firstName,
    employee.preferredName ? `(${employee.preferredName})` : null,
    employee.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section>
      <div className="flex justify-between">
        <Link
          to="/"
          className="flex justify-start text-indigo-600 font-medium text-base hover:underline transition-colors cursor-pointer hover:text-indigo-800 3xl:text-2xl"
        >
          ← Back to Team
        </Link>
        <button
          onClick={(): void => toggleEditing()}
          className="flex justify-start text-indigo-600 font-medium text-base hover:underline transition-colors cursor-pointer hover:text-indigo-800 3xl:text-2xl"
        >
          {isEditing ? "View mode" : "Edit"}
        </button>
      </div>
      <div className="flex flex-col align-middle gap-1">
        <h1 className="text-2xl text-zinc-950 font-bold text-center 3xl:text-4xl">
          {fullName}
        </h1>
        <p className="text-sm text-zinc-600 text-center 3xl:text-xl">
          {employee?.role?.name}
        </p>
      </div>
      {isEditing ? (
        <EmployeeForm
          handlePageSubmit={handleSubmit}
          handleWarningClick={handleCancelClick}
          submitBtnText="Save Changes"
          warningBtnText="Delete Employee"
        />
      ) : (
        <EmployeeDetails employee={employee} />
      )}
    </section>
  );
}
