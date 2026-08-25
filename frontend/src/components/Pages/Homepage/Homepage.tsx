import EmployeeList from "../../EmployeeList/EmployeeList";
import Header from "../../Header/Header";
import SearchBar from "../../SearchBar/SearchBar";

export default function Homepage() {
  return (
    <section className="w-full flex flex-col gap-5 3xl:gap-7">
      <Header />
      <SearchBar />
      <EmployeeList />
    </section>
  );
}
