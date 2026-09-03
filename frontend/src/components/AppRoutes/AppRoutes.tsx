import { Route, Routes } from "react-router-dom";
import Homepage from "../Pages/Homepage/Homepage";
import EmployeePage from "../Pages/EmployeePage.tsx/EmployeePage";
import CreateEmployeePage from "../Pages/CreateEmployeePage/CreateEmployeePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/create" element={<CreateEmployeePage />} />
      <Route path="/:id" element={<EmployeePage />} />
    </Routes>
  );
}
