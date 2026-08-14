import "./CompanyDetailsPage.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import homeIcon from "./assets/home.png";
import officeIcon from "./assets/office-building.png";
import teamIcon from "./assets/team.png";

function CompanyDetailsPage() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token is required");
        }

        const response = await fetch(
          `http://localhost:5000/api/departments/company/${companyId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load company details"
          );
        }

        console.log("Company details:", data);

        setCompany(data?.company || null);

        setDepartments(
          Array.isArray(data?.departments)
            ? data.departments
            : []
        );
      } catch (err) {
        console.error("Company details error:", err);

        setError(
          err.message || "Failed to load company details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      loadCompany();
    }
  }, [companyId]);

  const goTo = (path) => {
    setMobileMenuOpen(false);

    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="company-details-app">

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileMenuOpen && (
        <div
          className="company-details-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* =================================================
          MAIN SHELL
      ================================================= */}

      <div className="company-details-shell">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          className={`company-details-sidebar ${
            mobileMenuOpen
              ? "company-details-sidebar-open"
              : ""
          }`}
        >

          <div className="company-details-sidebar-top">

            {/* LOGO */}

            <div className="company-details-logo">

              <strong>
                EMPLOYEE
                <br />
                MANAGEMENT SYSTEM
              </strong>

            </div>


            {/* NAVIGATION */}

            <nav className="company-details-navigation">

              <button
                type="button"
                className="company-details-nav-item"
                onClick={() => goTo("/")}
              >
                <span className="company-details-nav-icon">
                  <img
                    src={homeIcon}
                    alt=""
                  />
                </span>

                <span>
                  Dashboard
                </span>
              </button>


              <button
                type="button"
                className="company-details-nav-item"
                onClick={() => goTo("/employees")}
              >
                <span className="company-details-nav-icon">
                  <img
                    src={teamIcon}
                    alt=""
                  />
                </span>

                <span>
                  Employees
                </span>
              </button>


              <button
                type="button"
                className="company-details-nav-item active"
                onClick={() => goTo("/companies")}
              >
                <span className="company-details-nav-icon">
                  <img
                    src={officeIcon}
                    alt=""
                  />
                </span>

                <span>
                  Companies
                </span>
              </button>

            </nav>

          </div>


          {/* LOGOUT */}

          <div className="company-details-sidebar-bottom">

            <button
              type="button"
              className="company-details-logout"
              onClick={logout}
            >
              <span>
                ↪
              </span>

              <span>
                Log out
              </span>
            </button>

          </div>

        </aside>


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="company-details-main">

          {/* =================================================
              TOPBAR
          ================================================= */}

          <header className="company-details-topbar">

            <button
              type="button"
              className="company-details-menu-button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
            >
              {mobileMenuOpen ? "×" : "☰"}
            </button>


            <div className="company-details-topbar-left">
            </div>


            <div className="company-details-user">

              <div className="company-details-user-info">

                <strong>
                  Rahma Nizer
                </strong>

                <small>
                  Administrator
                </small>

              </div>


              <div className="company-details-avatar">
                RN
              </div>

            </div>

          </header>


          {/* =================================================
              PAGE CONTENT
          ================================================= */}

          <div className="company-details-content">

            {/* BACK */}

            <button
              type="button"
              className="company-details-back"
              onClick={() =>
                navigate("/companies")
              }
            >
              ← Back to companies
            </button>


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <div className="company-details-state">
                Loading company...
              </div>
            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {!loading && error && (
              <div className="company-details-state company-details-error">
                {error}
              </div>
            )}


            {/* =================================================
                COMPANY
            ================================================= */}

            {!loading &&
              !error &&
              company && (
                <>

                  {/* HEADER */}

                  <section className="company-details-heading">

                    <div>

                      <p className="company-details-label">
                        ORGANIZATION
                      </p>


                      <h1>
                        {company.name ||
                          company.company_name ||
                          "Company"}
                      </h1>


                      <p className="company-details-description">
                        Departments and employees
                        belonging to this company.
                      </p>

                    </div>


                    <div className="company-details-company-id">
                      Company ID:{" "}
                      {company.company_id}
                    </div>

                  </section>


                  {/* =================================================
                      DEPARTMENTS
                  ================================================= */}

                  <section className="company-details-section">

                    <div className="company-details-section-header">

                      <div>

                        <h2>
                          Departments
                        </h2>

                        <p>
                          {departments.length}{" "}
                          {departments.length === 1
                            ? "department"
                            : "departments"}
                        </p>

                      </div>

                    </div>


                    {departments.length === 0 ? (

                      <div className="company-details-empty">
                        No departments found for
                        this company.
                      </div>

                    ) : (

                      <div className="company-details-department-grid">

                        {departments.map(
                          (department) => {

                            const name =
                              department.name ||
                              "Department";

                            const status =
                              department.status ||
                              "ACTIVE";

                            return (

                              <button
                                type="button"
                                key={
                                  department.department_id
                                }
                                className="company-details-department-card"
                                onClick={() =>
                                  navigate(
                                    `/companies/${companyId}/departments/${department.department_id}`
                                  )
                                }
                              >

                                {/* ICON */}

                                <div className="company-details-department-icon">

                                  {name
                                    .charAt(0)
                                    .toUpperCase()}

                                </div>


                                {/* INFO */}

                                <div className="company-details-department-info">

                                  <h3>
                                    {name}
                                  </h3>

                                  <span
                                    className={`company-details-status ${
                                      String(status).toLowerCase() ===
                                      "active"
                                        ? "active"
                                        : "inactive"
                                    }`}
                                  >
                                    {status}
                                  </span>

                                </div>


                                {/* ARROW */}

                                <span className="company-details-arrow">
                                  →
                                </span>

                              </button>

                            );
                          }
                        )}

                      </div>

                    )}

                  </section>

                </>
              )}

          </div>

        </main>

      </div>

    </div>
  );
}

export default CompanyDetailsPage;