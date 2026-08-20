import EmployeeCard from "../EmployeeCard/EmployeeCard";

export default function EmployeeList() {
  const employees = [
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Chen",
      emailAddress: "sarah.chen@mycompany.com",
      jobTitle: "Software Engineer",
      department: "Engineering",
      startDate: "2021-03-15",
      seniority: "Senior",
    },
    {
      id: "2",
      firstName: "Marcus",
      lastName: "Vance",
      emailAddress: "marcus.vance@mycompany.com",
      jobTitle: "Product Designer",
      department: "Design",
      startDate: "2023-08-01",
      seniority: "Mid-Level",
    },
    {
      id: "3",
      firstName: "Elena",
      lastName: "Rostova",
      emailAddress: "elena.rostova@mycompany.com",
      jobTitle: "QA Analyst",
      department: "Quality Assurance",
      startDate: "2024-01-10",
      seniority: "Junior",
    },
    {
      id: "4",
      firstName: "David",
      lastName: "Kim",
      emailAddress: "david.kim@mycompany.com",
      jobTitle: "DevOps Engineer",
      department: "Infrastructure",
      startDate: "2019-11-20",
      seniority: "Lead",
    },
    {
      id: "5",
      firstName: "Maya",
      lastName: "Patel",
      emailAddress: "maya.patel@mycompany.com",
      jobTitle: "Frontend Developer",
      department: "Engineering",
      startDate: "2023-05-12",
      seniority: "Junior",
    },
    {
      id: "6",
      firstName: "James",
      lastName: "Wilson",
      emailAddress: "james.wilson@mycompany.com",
      jobTitle: "Engineering Manager",
      department: "Engineering",
      startDate: "2018-06-04",
      seniority: "Principal",
    },
  ];

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
