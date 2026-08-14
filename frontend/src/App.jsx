import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./DashboardPage.jsx";
import CompanyPage from "./CompanyPage.jsx";
import CompanyDetailsPage from "./CompanyDetailsPage.jsx";
import DepartmentPage from "./DepartmentPage.jsx";
import EmployeeDetailsPage from "./EmployeeDetailsPage.jsx";
import EmployeesPage from "./EmployeesPage.jsx";
import RegisterPage from "./RegisterPage.jsx";

import LoginPage from "./LoginPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
    return (
        <Routes>

            {/* PUBLIC ROUTES */}

            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route
                path="/register"
                element={<RegisterPage />}
            />

            {/* PROTECTED ROUTES */}

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            {/* ADMIN + HR */}

            <Route
                path="/companies"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "HR"
                        ]}
                    >
                        <CompanyPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/companies/:companyId"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "HR"
                        ]}
                    >
                        <CompanyDetailsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/companies/:companyId/departments/:departmentId"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "HR"
                        ]}
                    >
                        <DepartmentPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employees"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "HR"
                        ]}
                    >
                        <EmployeesPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/employees/:employeeId"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "ADMIN",
                            "HR"
                        ]}
                    >
                        <EmployeeDetailsPage />
                    </ProtectedRoute>
                }
            />

            {/* UNKNOWN ROUTE */}

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