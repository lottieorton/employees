export default function SearchBar() {
  const dropdownOptions = [
    { id: 0, value: "", text: "Search by..." },
    { id: 1, value: "name", text: "Name" },
    { id: 2, value: "role", text: "Role" },
    { id: 3, value: "contractType", text: "Contract Type" },
    { id: 4, value: "seniority", text: "Seniority" },
  ];

  return (
    <form className="flex gap-3 w-full justify-between">
      <div className="bg-white border border-solid border-zinc-200 py-3 px-4 rounded-md flex flex-1 gap-1 items-center focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
        <i className="fa-solid fa-magnifying-glass text-zinc-400 text-sm 3xl:text-xl"></i>
        <input
          type="text"
          className="text-zinc-600 flex-1 outline-none text-sm placeholder:text-zinc-400 bg-transparent 3xl:text-xl"
          placeholder="Search by name, role, etc"
        />
      </div>
      <select className="bg-white border border-solid border-zinc-200 py-3 px-4 rounded-md text-zinc-600 text-sm focus:outline-indigo-600 cursor-pointer 3xl:text-xl">
        {dropdownOptions.map((f) => {
          return (
            <option key={f.id} value={f.value}>
              {f.text}
            </option>
          );
        })}
      </select>
    </form>
  );
}
