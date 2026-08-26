import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./components/Pages/Homepage/Homepage";
import EmployeePage from "./components/Pages/EmployeePage.tsx/EmployeePage";
import CreateEmployeePage from "./components/Pages/CreateEmployeePage/CreateEmployeePage";

function App() {
  return (
    <main className="bg-gray-50 min-h-screen flex flex-col items-center">
      <section className="font-sans p-4 flex flex-col w-full max-w-250 md:p-10 3xl:max-w-350">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/create" element={<CreateEmployeePage />} />
            <Route path="/1" element={<EmployeePage />} />
          </Routes>
        </BrowserRouter>
      </section>
    </main>
  );
}

export default App;
