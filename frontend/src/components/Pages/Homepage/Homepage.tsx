import { useState } from "react";
import EmployeeList from "../../EmployeeList/EmployeeList";
import Header from "../../Header/Header";
import SearchBar from "../../SearchBar/SearchBar";

export default function Homepage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("");

  return (
    <section className="w-full flex flex-col gap-5 3xl:gap-7">
      <Header />
      <SearchBar handleSearch={setSearchTerm} handleSearchBy={setSearchBy} />
      <EmployeeList searchTerm={searchTerm} searchBy={searchBy} />
    </section>
  );
}
