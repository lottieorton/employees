import { Link, useNavigate } from "react-router-dom";
import EmployeeForm from "../../EmployeeForm/EmployeeForm";
import type { FormValues } from "../../../schemas/employeeSchema";
import { useCreateEmployee } from "../../../hooks/useEmployees";
import { createAddress } from "../../../services/addresses-service";
import { toast } from "react-toastify";
import { useState } from "react";

export default function CreateEmployeePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { mutateAsync: createEmployee } = useCreateEmployee();

  const handleSubmit = async (formData: FormValues) => {
    setIsSubmitting(true);
    try {
      const address = await createAddress(formData);
      const employeeFormData = {
        ...formData,
        addressId: address.id,
      };
      await createEmployee(employeeFormData);
      navigate("/");
    } catch (err) {
      toast.error("Oops, something went wrong when creating this employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelClick = () => {
    navigate("/");
  };

  return (
    <section>
      <Link
        to="/"
        className="flex justify-start text-indigo-600 font-medium text-base hover:underline transition-colors cursor-pointer hover:text-indigo-800 3xl:text-2xl"
      >
        ← Back to Team
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl text-zinc-950 font-bold text-center 3xl:text-4xl">
          Create New Employee
        </h1>
      </div>
      <EmployeeForm
        handlePageSubmit={handleSubmit}
        handleWarningClick={handleCancelClick}
        submitBtnText={isSubmitting ? "Creating..." : "Create Employee"}
        warningBtnText="Cancel"
        hasEmail={false}
      />
    </section>
  );
}
