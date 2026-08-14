
import "./DepartmentPage.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import homeIcon from "./assets/home.png";
import officeIcon from "./assets/office-building.png";
import teamIcon from "./assets/team.png";

function DepartmentPage() {
  const navigate = useNavigate();
  const { companyId, departmentId } = useParams();

  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_items: 0,
    total_pages: 0,
  });

  useEffect(() => {
    const loadDepartment = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token is required");
        }

        const response = await fetch(
          `http://localhost:5000/api/departments/${departmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load department"
          );
        }

        setDepartment(data);
      } catch (err) {
        console.error("Department error:", err);
        setError(err.message || "Failed to load department");
      }
    };

    if (departmentId) {
      loadDepartment();
    }
  }, [departmentId]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token is required");
        }

        const response = await fetch(
          `http://localhost:5000/api/employees?department_id=${departmentId}&page=${page}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load employees"
          );
        }

        setEmployees(
          Array.isArray(data?.employees)
            ? data.employees
            : []
        );

        setPagination(
          data?.pagination || {
            current_page: page,
            per_page: 10,
            total_items: 0,
            total_pages: 0,
          }
        );
      } catch (err) {
        console.error("Employees error:", err);
        setError(err.message || "Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    if (departmentId) {
      loadEmployees();
    }
  }, [departmentId, page]);

  const goTo = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="department-app">

      {mobileMenuOpen && (
        <div
          className="department-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="department-shell">

        {/* SIDEBAR */}

        <aside
          className={`department-sidebar ${
            mobileMenuOpen
              ? "department-sidebar-open"
              : ""
          }`}
        >
          <div className="department-sidebar-top">

            <div className="department-logo">
              <strong>
                EMPLOYEE
                <br />
                MANAGEMENT SYSTEM
              </strong>
            </div>

            <nav className="department-navigation">

              <button
                type="button"
                className="department-nav-item"
                onClick={() => goTo("/")}
              >
                <span className="department-nav-icon">
                  <img src={homeIcon} alt="" />
                </span>

                Dashboard
              </button>

              <button
                type="button"
                className="department-nav-item"
                onClick={() => goTo("/employees")}
              >
                <span className="department-nav-icon">
                  <img src={teamIcon} alt="" />
                </span>

                Employees
              </button>

              <button
                type="button"
                className="department-nav-item active"
                onClick={() => goTo("/companies")}
              >
                <span className="department-nav-icon">
                  <img src={officeIcon} alt="" />
                </span>

                Companies
              </button>

            </nav>
          </div>

          <div className="department-sidebar-bottom">

            <button
              type="button"
              className="department-logout"
              onClick={logout}
            >
              <span>↪</span>
              <span>Log out</span>
            </button>

          </div>
        </aside>

        {/* MAIN */}

        <main className="department-main">

          {/* TOPBAR */}

          <header className="department-topbar">

            <button
              type="button"
              className="department-menu-button"
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
            >
              {mobileMenuOpen ? "×" : "☰"}
            </button>

            <div className="department-topbar-spacer" />

            <div className="department-user">

              <div className="department-user-info">
                <strong>Rahma Nizer</strong>
                <small>Administrator</small>
              </div>

              <div className="department-avatar">
                RN
              </div>

            </div>

          </header>

          {/* CONTENT */}

          <div className="department-content">

            <button
              type="button"
              className="department-back"
              onClick={() =>
                navigate(`/companies/${companyId}`)
              }
            >
              ← Back to departments
            </button>

            {error && (
              <div className="department-error">
                {error}
              </div>
            )}

            {/* DEPARTMENT HEADER */}

            {department && (
              <section className="department-heading">

                <div>

                  <p className="department-label">
                    DEPARTMENT
                  </p>

                  <h1>
                    {department.department_name ||
                      department.name ||
                      "Department"}
                  </h1>

                  <p className="department-description">
                    Employees currently assigned to this
                    department.
                  </p>

                </div>

                <div className="department-meta">

                  <span>
                    Company
                  </span>

                  <strong>
                    {department.company_name ||
                      "—"}
                  </strong>

                  <span className="department-meta-status">
                    {department.status ||
                      "ACTIVE"}
                  </span>

                </div>

              </section>
            )}

            {/* EMPLOYEES */}

            <section className="department-employees-section">

              <div className="department-section-header">

                <div>
                  <h2>Employees</h2>

                  <p>
                    {pagination.total_items}{" "}
                    {pagination.total_items === 1
                      ? "employee"
                      : "employees"}
                  </p>
                </div>

              </div>

              {loading ? (

                <div className="department-state">
                  Loading employees...
                </div>

              ) : employees.length === 0 ? (

                <div className="department-state">
                  No employees found in this department.
                </div>

              ) : (

                <div className="department-table-wrapper">

                  <table className="department-table">

                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Joined</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>

                      {employees.map((employee) => (

                        <tr key={employee.employee_id}>

                          <td>
                            <div className="department-employee">

                              <div className="department-employee-avatar">
                                {employee.first_name
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                                {employee.last_name
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {employee.first_name}{" "}
                                  {employee.last_name}
                                </strong>

                                <small>
                                  ID #{employee.employee_id}
                                </small>
                              </div>

                            </div>
                          </td>

                          <td>
                            {employee.email || "—"}
                          </td>

                          <td>
                            {employee.phone || "—"}
                          </td>

                          <td>
                            {formatDate(
                              employee.joining_date
                            )}
                          </td>

                          <td>

                            <span
                              className={`department-status ${
                                String(
                                  employee.status
                                ).toLowerCase() ===
                                "active"
                                  ? "active"
                                  : "inactive"
                              }`}
                            >
                              {employee.status}
                            </span>

                          </td>

                          <td>

                            <button
                              type="button"
                              className="department-view-button"
                              onClick={() =>
                                navigate(
                                  `/employees/${employee.employee_id}`
                                )
                              }
                            >
                              View
                            </button>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>
              )}

              {/* PAGINATION */}

              {!loading &&
                pagination.total_pages > 1 && (

                  <div className="department-pagination">

                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() =>
                        setPage((current) =>
                          Math.max(current - 1, 1)
                        )
                      }
                    >
                      ← Previous
                    </button>

                    <span>
                      Page {pagination.current_page}{" "}
                      of {pagination.total_pages}
                    </span>

                    <button
                      type="button"
                      disabled={
                        page ===
                        pagination.total_pages
                      }
                      onClick={() =>
                        setPage((current) =>
                          Math.min(
                            current + 1,
                            pagination.total_pages
                          )
                        )
                      }
                    >
                      Next →
                    </button>

                  </div>
                )}

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

export default DepartmentPage;
