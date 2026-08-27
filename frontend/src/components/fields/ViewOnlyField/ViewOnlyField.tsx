interface ViewOnlyFieldProps {
  label: string;
  value?: string | null;
  colSpan?: string;
}

export default function ViewOnlyField({
  label,
  value,
  colSpan = "col-span-1",
}: ViewOnlyFieldProps) {
  return (
    <div className={colSpan}>
      <h4 className="text-sm text-zinc-500 3xl:text-xl">{label}</h4>
      <p className="text-sm font-bold text-zinc-950 3xl:text-xl border-b border-zinc-200 p-2    ">
        {value && value.trim() !== "" ? value : "—"}
      </p>
    </div>
  );
}
