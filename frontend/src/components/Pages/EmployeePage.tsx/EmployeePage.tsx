import { useState } from "react";
import { Link } from "react-router-dom";
import EmployeeForm from "../../EmployeeForm/EmployeeForm";
import EmployeeDetails from "../../EmployeeDetails/EmployeeDetails";

export default function EmployeePage() {
  const [isEditing, setIsEditing] = useState(false);

  const employee = {
    id: "1",
    firstName: "Charlotte",
    preferredName: "Lottie",
    lastName: "Orton",
    emailAddress: "sarah.chen@mycompany.com",
    roleName: "Software Engineer",
    department: "Engineering",
    startDate: "2021-03-15",
    seniority: "Senior",
  };

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
          onClick={() => setIsEditing((prev) => !prev)}
          className="flex justify-start text-indigo-600 font-medium text-base hover:underline transition-colors cursor-pointer hover:text-indigo-800 3xl:text-2xl"
        >
          {isEditing ? "View mode" : "Edit"}
        </button>
      </div>
      <div className="flex flex-col align-middle gap-1">
        <h1 className="text-2xl text-zinc-950 font-bold text-center 3xl:text-4xl">{`${employee.firstName} ${employee.preferredName && `(${employee.preferredName})`} ${employee.lastName}`}</h1>
        <p className="text-sm text-zinc-600 text-center 3xl:text-xl">
          {employee.roleName}
        </p>
      </div>
      {isEditing ? <EmployeeForm /> : <EmployeeDetails />}
    </section>
  );
}
