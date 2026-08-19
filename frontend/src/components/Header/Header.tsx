import Button from "../Button/Button";

export default function Header() {
  return (
    <section className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl text-zinc-950 font-bold">Team</h1>
        <h3 className="text-sm text-zinc-600">5 active employees</h3>
      </div>
      <Button />
    </section>
  );
}
