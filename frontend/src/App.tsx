import "./App.css";
import EmployeeList from "./components/EmployeeList/EmployeeList";
import SearchBar from "./components/SearchBar/SearchBar";
import Header from "./components/Header/Header";
import EmployeeForm from "./components/EmployeeForm/EmployeeForm";

function App() {
  return (
    <main className="bg-gray-50 font-sans min-h-screen p-1 px-6 py-6 flex flex-col gap-5">
      <Header />
      <SearchBar />
      <EmployeeList />
      <EmployeeForm />
    </main>
  );
}

export default App;
