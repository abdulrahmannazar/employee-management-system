import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./DashboardPage.jsx";
import CompanyPage from "./CompanyPage.jsx";

function App() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Companies */}
      <Route path="/companies" element={<CompanyPage />} />

      {/* Individual company */}
      <Route
        path="/companies/:companyId"
        element={<CompanyPage />}
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;