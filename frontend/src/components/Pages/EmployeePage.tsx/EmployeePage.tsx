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
import { toast } from "react-toastify";

export default function EmployeePage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: employee,
    isLoading,
    isError: isFetchEmployeeError,
  } = useEmployee(id, {
    enabled: Boolean(id) && !isDeleting,
  });
  const { mutateAsync: updateEmployee } = useUpdateEmployee();
  const { mutate: deleteEmployee } = useDeleteEmployee();

  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSubmit = async (
    formData: FormValues,
    id?: number,
    addressId?: number,
  ) => {
    if (!id || !addressId) {
      toast.error(
        "Oops something went wrong with trying to update this employee",
      );
      return;
    }
    setIsSaving(true);
    try {
      await updateAddress(addressId, formData);
      const payload = {
        ...formData,
        addressId,
      };
      await updateEmployee({ id, formData: payload });
      toggleEditing();
    } catch (err) {
      const customMessage =
        "This email address is already in use. Please use another";
      const isDuplicateEmail =
        err instanceof Error && err.message.includes(customMessage);
      toast.error(
        isDuplicateEmail
          ? customMessage
          : "Oops something went wrong with trying to update this employee",
      );
    } finally {
      setIsSaving(false);
    }
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
        onError: (err) => {
          const errorMsg =
            err.message ===
            "Cannot delete this employee as they are currently a manager of other employee(s)"
              ? err.message
              : "Oops, something went wrong when deleting this employee.";
          toast.error(errorMsg);
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
          {isEditing ? "View" : "Edit"}
        </button>
      </div>
      <div className="flex flex-col gap-1">
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
          submitBtnText={isSaving ? "Saving..." : "Save Changes"}
          warningBtnText={isDeleting ? "Deleting..." : "Delete Employee"}
          employee={employee}
        />
      ) : (
        <EmployeeDetails employee={employee} />
      )}
    </section>
  );
}
