import "./App.css";
import EmployeeForm from "./components/EmployeeForm/EmployeeForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./components/Pages/Homepage/Homepage";

function App() {
  return (
    <main className="bg-gray-50 min-h-screen flex flex-col items-center">
      <section className="font-sans p-4 flex flex-col w-full max-w-250 md:p-10 3xl:max-w-350">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/1" element={<EmployeeForm />} />
          </Routes>
        </BrowserRouter>
      </section>
    </main>
  );
}

export default App;
