import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./DashboardPage.jsx";
import CompanyPage from "./CompanyPage.jsx";
import CompanyDetailsPage from "./CompanyDetailsPage.jsx";
import DepartmentPage from "./DepartmentPage.jsx";
import EmployeeDetailsPage from "./EmployeeDetailsPage.jsx";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<DashboardPage />}
      />

      <Route
        path="/dashboard"
        element={<DashboardPage />}
      />

      <Route
        path="/companies"
        element={<CompanyPage />}
      />

      <Route
        path="/companies/:companyId"
        element={<CompanyDetailsPage />}
      />

      <Route
        path="/companies/:companyId/departments/:departmentId"
        element={<DepartmentPage />}
      />

      <Route
        path="/employees/:employeeId"
        element={<EmployeeDetailsPage />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;