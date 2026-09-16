import { useEffect, useState } from "react";
import { dropdownOptions } from "../../interfaces/SearchQuery";

interface SearchBarProps {
  initialSearchValue: string;
  initialSearchByValue: string;
  handleSearch: (term: string, by: string) => void;
}

export default function SearchBar({
  initialSearchValue,
  initialSearchByValue,
  handleSearch,
}: SearchBarProps) {
  const [input, setInput] = useState(initialSearchValue);
  const [selectedSearchBy, setSelectedSearchBy] =
    useState(initialSearchByValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(input, selectedSearchBy);
    }, 500);

    return () => clearTimeout(timeout);
  }, [input, selectedSearchBy]);

  const handleSearchByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSearchBy(e.target.value);
  };

  return (
    <form
      className="flex gap-3 w-full justify-between"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="bg-white border border-solid border-zinc-200 py-3 px-4 rounded-md flex flex-1 gap-1 items-center focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
        <i
          className="fa-solid fa-magnifying-glass text-zinc-400 text-sm 3xl:text-xl"
          aria-label="Search icon"
        ></i>
        <input
          type="text"
          className="text-zinc-600 flex-1 outline-none text-sm placeholder:text-zinc-400 bg-transparent 3xl:text-xl"
          placeholder="Search by name, role, etc"
          onChange={handleChange}
          value={input}
        />
      </div>
      <select
        value={selectedSearchBy}
        onChange={handleSearchByChange}
        className="bg-white border border-solid border-zinc-200 py-3 px-4 rounded-md text-zinc-600 text-sm focus:outline-indigo-600 cursor-pointer 3xl:text-xl"
      >
        {dropdownOptions.map((f) => {
          return (
            <option key={f.value} value={f.value}>
              {f.text}
            </option>
          );
        })}
      </select>
    </form>
  );
}
