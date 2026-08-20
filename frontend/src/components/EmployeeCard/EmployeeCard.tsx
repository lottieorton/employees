interface EmployeeProps {
  employee: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    jobTitle: string;
    department: string;
    startDate: string;
    seniority: string;
  };
  bgColor: string;
}

export default function EmployeeCard({ employee, bgColor }: EmployeeProps) {
  const btnBase =
    "font-medium text-base hover:underline transition-colors cursor-pointer";

  return (
    <article
      className={`flex justify-between border-b border-zinc-200 p-4 ${bgColor}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <h3 className="text-base text-zinc-950 font-semibold">{`${employee.firstName} ${employee.lastName}`}</h3>
          <p className="text-sm text-zinc-500">{employee.jobTitle}</p>
        </div>
        <p className="text-base text-zinc-700">{employee.emailAddress}</p>
      </div>
      <div className="flex flex-col justify-between">
        <p className="text-sm text-zinc-500">Joined {employee.startDate}</p>
        <div className="flex justify-end gap-2">
          <button
            className={`text-indigo-600 ${btnBase} hover:text-indigo-800`}
          >
            View
          </button>
          <button className={`text-red-500 ${btnBase} hover:text-rose-600`}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
