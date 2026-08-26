import { Link, useNavigate } from "react-router-dom";
import EmployeeForm from "../../EmployeeForm/EmployeeForm";

export default function CreateEmployeePage() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // create address
    // createuser
    navigate("/");
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
      <div className="flex flex-col align-middle gap-1">
        <h1 className="text-2xl text-zinc-950 font-bold text-center 3xl:text-4xl">
          Create New Employee
        </h1>
      </div>
      <EmployeeForm
        handlePageSubmit={handleSubmit}
        handleWarningClick={handleCancelClick}
        submitBtnText="Create Employee"
        warningBtnText="Cancel"
      />
    </section>
  );
}
