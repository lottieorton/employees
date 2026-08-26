import { Link } from "react-router-dom";
import type { Employee } from "../../interfaces/Employee";

interface EmployeeProps {
  employee: Employee;
  bgColor: string;
}

export default function EmployeeCard({ employee, bgColor }: EmployeeProps) {
  const btnBase =
    "font-medium text-base hover:underline transition-colors cursor-pointer 3xl:text-2xl";

  return (
    <article
      className={`flex justify-between border-b border-zinc-200 p-4 ${bgColor}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <h3 className="text-base text-zinc-950 font-semibold 3xl:text-2xl">{`${employee.firstName} ${employee.lastName}`}</h3>
          <p className="text-sm text-zinc-500 3xl:text-xl">
            {employee.role?.name}
          </p>
        </div>
        <p className="text-base text-zinc-700 3xl:text-2xl">
          {employee.emailAddress}
        </p>
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-sm text-zinc-500 3xl:text-xl text-right">
          Joined {employee.startDate}
        </p>
        <div className="flex justify-end gap-2">
          <Link
            to={`/${employee.id}`}
            className={`text-indigo-600 ${btnBase} hover:text-indigo-800`}
          >
            View
          </Link>
          <button className={`text-red-500 ${btnBase} hover:text-rose-600`}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
