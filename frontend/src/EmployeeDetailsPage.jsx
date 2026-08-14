
import "./EmployeeDetailsPage.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import homeIcon from "./assets/home.png";
import officeIcon from "./assets/office-building.png";
import teamIcon from "./assets/team.png";

function EmployeeDetailsPage() {
  const navigate = useNavigate();
  const { employeeId } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token is required");
        }

        const response = await fetch(
          `https://employee-management-system-cb7g.onrender.com/api/employees/${employeeId}`,
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
            data?.message || "Failed to load employee"
          );
        }

        setEmployee(data);
      } catch (err) {
        console.error("Employee details error:", err);

        setError(
          err.message || "Failed to load employee details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      loadEmployee();
    }
  }, [employeeId]);

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
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = () => {
    if (!employee) return "EM";

    const first =
      employee.first_name?.charAt(0) || "";

    const last =
      employee.last_name?.charAt(0) || "";

    return `${first}${last}`.toUpperCase();
  };

  const isActive =
    String(employee?.status || "").toLowerCase() ===
    "active";

  return (
    <div className="employee-details-app">

      {mobileMenuOpen && (
        <div
          className="employee-details-overlay"
          onClick={() =>
            setMobileMenuOpen(false)
          }
        />
      )}

      <div className="employee-details-shell">

        {/* SIDEBAR */}

        <aside
          className={`employee-details-sidebar ${
            mobileMenuOpen
              ? "employee-details-sidebar-open"
              : ""
          }`}
        >
          <div className="employee-details-sidebar-top">

            <div className="employee-details-logo">
              <strong>
                EMPLOYEE
                <br />
                MANAGEMENT SYSTEM
              </strong>
            </div>

            <nav className="employee-details-navigation">

              <button
                type="button"
                className="employee-details-nav-item"
                onClick={() => goTo("/")}
              >
                <span className="employee-details-nav-icon">
                  <img
                    src={homeIcon}
                    alt=""
                  />
                </span>

                Dashboard
              </button>

              <button
                type="button"
                className="employee-details-nav-item active"
                onClick={() =>
                  goTo("/employees")
                }
              >
                <span className="employee-details-nav-icon">
                  <img
                    src={teamIcon}
                    alt=""
                  />
                </span>

                Employees
              </button>

              <button
                type="button"
                className="employee-details-nav-item"
                onClick={() =>
                  goTo("/companies")
                }
              >
                <span className="employee-details-nav-icon">
                  <img
                    src={officeIcon}
                    alt=""
                  />
                </span>

                Companies
              </button>

            </nav>
          </div>

          <div className="employee-details-sidebar-bottom">

            <button
              type="button"
              className="employee-details-logout"
              onClick={logout}
            >
              <span>↪</span>
              <span>Log out</span>
            </button>

          </div>
        </aside>

        {/* MAIN */}

        <main className="employee-details-main">

          {/* TOPBAR */}

          <header className="employee-details-topbar">

            <button
              type="button"
              className="employee-details-menu-button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
            >
              {mobileMenuOpen ? "×" : "☰"}
            </button>

            <div className="employee-details-topbar-spacer" />

            <div className="employee-details-user">

              <div className="employee-details-user-info">
                <strong>
                  Rahma Nizer
                </strong>

                <small>
                  Administrator
                </small>
              </div>

              <div className="employee-details-avatar">
                RN
              </div>

            </div>

          </header>

          {/* CONTENT */}

          <div className="employee-details-content">

            <button
              type="button"
              className="employee-details-back"
              onClick={() =>
                navigate(-1)
              }
            >
              ← Back
            </button>

            {loading && (
              <div className="employee-details-state">
                Loading employee...
              </div>
            )}

            {error && !loading && (
              <div className="employee-details-error">
                {error}
              </div>
            )}

            {!loading &&
              !error &&
              employee && (
                <>
                  {/* PROFILE HEADER */}

                  <section className="employee-profile-header">

                    <div className="employee-profile-main">

                      <div className="employee-profile-photo">
                        {getInitials()}
                      </div>

                      <div>

                        <p className="employee-profile-label">
                          EMPLOYEE PROFILE
                        </p>

                        <h1>
                          {employee.first_name}{" "}
                          {employee.last_name}
                        </h1>

                        <p className="employee-profile-id">
                          Employee ID #
                          {employee.employee_id}
                        </p>

                      </div>

                    </div>

                    <span
                      className={`employee-profile-status ${
                        isActive
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {employee.status || "UNKNOWN"}
                    </span>

                  </section>

                  {/* INFORMATION */}

                  <section className="employee-info-grid">

                    {/* PERSONAL */}

                    <div className="employee-info-card">

                      <div className="employee-info-card-header">
                        <h2>
                          Personal Information
                        </h2>
                      </div>

                      <div className="employee-info-list">

                        <div className="employee-info-row">
                          <span>
                            First Name
                          </span>

                          <strong>
                            {employee.first_name ||
                              "—"}
                          </strong>
                        </div>

                        <div className="employee-info-row">
                          <span>
                            Last Name
                          </span>

                          <strong>
                            {employee.last_name ||
                              "—"}
                          </strong>
                        </div>

                        <div className="employee-info-row">
                          <span>
                            Email
                          </span>

                          <strong>
                            {employee.email ||
                              "—"}
                          </strong>
                        </div>

                        <div className="employee-info-row">
                          <span>
                            Phone
                          </span>

                          <strong>
                            {employee.phone ||
                              "—"}
                          </strong>
                        </div>

                      </div>

                    </div>

                    {/* EMPLOYMENT */}

                    <div className="employee-info-card">

                      <div className="employee-info-card-header">
                        <h2>
                          Employment Information
                        </h2>
                      </div>

                      <div className="employee-info-list">

                        <div className="employee-info-row">
                          <span>
                            Company
                          </span>

                          <strong>
                            {employee.company_name ||
                              "—"}
                          </strong>
                        </div>

                        <div className="employee-info-row">
                          <span>
                            Department
                          </span>

                          <strong>
                            {employee.department_name ||
                              "—"}
                          </strong>
                        </div>

                        <div className="employee-info-row">
                          <span>
                            Manager
                          </span>

                          <strong>
                            {employee.manager_name ||
                              "—"}
                          </strong>
                        </div>

                        <div className="employee-info-row">
                          <span>
                            Joining Date
                          </span>

                          <strong>
                            {formatDate(
                              employee.joining_date
                            )}
                          </strong>
                        </div>

                      </div>

                    </div>

                  </section>

                  {/* ADDITIONAL */}

                  <section className="employee-additional-card">

                    <div className="employee-info-card-header">
                      <h2>
                        Employee Information
                      </h2>
                    </div>

                    <div className="employee-additional-grid">

                      <div>
                        <span>
                          Employee ID
                        </span>

                        <strong>
                          #
                          {employee.employee_id}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Status
                        </span>

                        <strong
                          className={
                            isActive
                              ? "employee-green"
                              : "employee-red"
                          }
                        >
                          {employee.status ||
                            "—"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Joined
                        </span>

                        <strong>
                          {formatDate(
                            employee.joining_date
                          )}
                        </strong>
                      </div>

                    </div>

                  </section>

                </>
              )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default EmployeeDetailsPage;
