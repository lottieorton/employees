import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "../../EmployeeForm/EmployeeForm";
import EmployeeDetails from "../../EmployeeDetails/EmployeeDetails";
import {
  useDeleteEmployee,
  useEmployee,
  useUpdateEmployee,
} from "../../../hooks/useEmployees";
import LoadingBanner from "../../LoadingBanner/LoadingBanner";
import ErrorBanner from "../../ErrorBanner/ErrorBanner";
import type { FormValues } from "../../../schemas/employeeSchema";
import { updateAddress } from "../../../services/addresses-service";

export default function EmployeePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: employee,
    isLoading,
    isError: isFetchEmployeeError,
  } = useEmployee(id, {
    enabled: Boolean(id) && !isDeleting,
  });
  const {
    mutate: updateEmployee,
    isError: isUpdateEmployeeError,
    error: updateEmployeeError,
  } = useUpdateEmployee();
  const {
    mutate: deleteEmployee,
    isError: isDeleteEmployeeError,
    error: deleteEmployeeError,
  } = useDeleteEmployee();

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSubmit = (
    formData: FormValues,
    id?: number,
    addressId?: number,
  ) => {
    if (!id || !addressId) {
      console.log("No employee id or no address id");
      return;
    }
    updateAddress(addressId, formData).then(() => {
      const payload = {
        ...formData,
        addressId,
      };
      updateEmployee({ id, formData: payload });
    });

    toggleEditing();
  };

  const handleDeleteClick = () => {
    if (!employee) return;
    setIsDeleting(true);
    deleteEmployee(
      { id: employee.id, addressId: employee.address?.id },
      {
        onSuccess: () => {
          navigate("/");
        },
        onError: () => {
          setIsDeleting(false);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Link
          to="/"
          className="flex justify-start text-indigo-600 font-medium text-base hover:underline transition-colors cursor-pointer hover:text-indigo-800 3xl:text-2xl"
        >
          ← Back to Team
        </Link>
        <LoadingBanner>Loading employee details...</LoadingBanner>
      </div>
    );
  }

  if (isFetchEmployeeError || !employee) {
    return (
      <div className="flex flex-col gap-3">
        <Link
          to="/"
          className="flex justify-start text-indigo-600 font-medium text-base hover:underline transition-colors cursor-pointer hover:text-indigo-800 3xl:text-2xl"
        >
          ← Back to Team
        </Link>
        <ErrorBanner>
          Failed to load employee details. Please try refreshing the page.
        </ErrorBanner>
      </div>
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
          handleWarningClick={handleDeleteClick}
          submitBtnText="Save Changes"
          warningBtnText="Delete Employee"
          employee={employee}
        />
      ) : (
        <EmployeeDetails employee={employee} />
      )}
    </section>
  );
}
