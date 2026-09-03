import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";

interface HeaderProps {
  numEmployees: number;
}
export default function Header({ numEmployees }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <section className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl text-zinc-950 font-bold 3xl:text-4xl">Team</h1>
        <p className="text-sm text-zinc-600 3xl:text-xl">
          {`${numEmployees} active employees`}
        </p>
      </div>
      <Button size="sm" type="primary" handleClick={() => navigate("/create")}>
        + Add Employee
      </Button>
    </section>
  );
}
