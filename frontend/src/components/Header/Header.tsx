import Button from "../Button/Button";

export default function Header() {
  return (
    <section className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl text-zinc-950 font-bold 3xl:text-4xl">Team</h1>
        <p className="text-sm text-zinc-600 3xl:text-xl">5 active employees</p>
      </div>
      <Button size="sm" type="primary">
        + Add Employee
      </Button>
    </section>
  );
}
