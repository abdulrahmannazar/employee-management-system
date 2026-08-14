import "./CompanyPage.css";
import { useEffect, useState } from "react";

import homeIcon from "./assets/home.png";
import officeIcon from "./assets/office-building.png";
import teamIcon from "./assets/team.png";


function CompanyPage() {

  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);


  // =====================================================
  // LOAD COMPANIES
  // =====================================================

  useEffect(() => {

    const loadCompanies = async () => {

      try {

        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");


        if (!token) {
          throw new Error(
            "Authentication token is required"
          );
        }


        const response =
          await fetch(
            "http://localhost:5000/api/companies",
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data?.message ||
            "Failed to fetch companies"
          );

        }


        console.log(
          "Companies:",
          data
        );


        const companyList =
          Array.isArray(data)
            ? data
            : data?.companies || [];


        setCompanies(
          companyList
        );

      } catch (err) {

        console.error(
          "Company error:",
          err
        );

        setError(
          err.message ||
          "Failed to load companies"
        );

      } finally {

        setLoading(false);

      }

    };


    loadCompanies();

  }, []);


  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {

    window.history.pushState(
      {},
      "",
      path
    );

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="company-page">

      <div className="company-bg-glow company-glow-purple"></div>

      <div className="company-bg-glow company-glow-blue"></div>


      <div className="company-shell">


        {/* =================================================
            MOBILE OVERLAY
        ================================================= */}

        {mobileMenuOpen && (
          <div
            className="company-mobile-overlay"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />
        )}


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          className={`company-sidebar ${
            mobileMenuOpen
              ? "company-sidebar-open"
              : ""
          }`}
        >

          <div>

            <div className="company-logo">

              <strong>
                EMPLOYEE
                <br />
                MANAGEMENT SYSTEM
              </strong>

            </div>


            <nav className="company-navigation">

              <button
                className="company-nav-item"
                onClick={() => {
                  setMobileMenuOpen(false);
                  goTo("/");
                }}
              >

                <span className="company-nav-icon">
                  <img
                    src={homeIcon}
                    alt=""
                  />
                </span>

                Dashboard

              </button>


              <button
                className="company-nav-item"
                onClick={() => {
                  setMobileMenuOpen(false);
                  goTo("/employees");
                }}
              >

                <span className="company-nav-icon">
                  <img
                    src={teamIcon}
                    alt=""
                  />
                </span>

                Employees

              </button>


              <button
                className="company-nav-item active"
                onClick={() => {
                  setMobileMenuOpen(false);
                  goTo("/companies");
                }}
              >

                <span className="company-nav-icon">
                  <img
                    src={officeIcon}
                    alt=""
                  />
                </span>

                Companies

              </button>

            </nav>

          </div>


          <button
            className="company-logout"
            onClick={() => {

              localStorage.removeItem(
                "token"
              );

              goTo("/login");

            }}
          >
            ↪
            <span>
              Log out
            </span>
          </button>

        </aside>


        {/* =================================================
            MAIN
        ================================================= */}

        <main className="company-main">


          {/* =================================================
              TOPBAR
          ================================================= */}

          <header className="company-topbar">

            <button
              className="company-menu-button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
            >
              {mobileMenuOpen
                ? "×"
                : "☰"}
            </button>


            <div></div>


            <div className="company-user">

              <div className="company-user-info">

                <strong>
                  Rahma Nizer
                </strong>

                <small>
                  Administrator
                </small>

              </div>


              <div className="company-avatar">
                RN
              </div>

            </div>

          </header>


          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="company-content">


            {/* HEADER */}

            <section className="company-heading">

              <div>

                <p className="company-label">
                  ORGANIZATION
                </p>

                <h1>
                  Companies
                </h1>

                <p>
                  Manage and explore all companies
                  in your organization.
                </p>

              </div>


              <button
                className="add-company-button"
              >
                + Add company
              </button>

            </section>


            {/* =================================================
                COMPANY LIST
            ================================================= */}

            {loading && (

              <div className="company-state">
                Loading companies...
              </div>

            )}


            {error && !loading && (

              <div className="company-state company-error">
                {error}
              </div>

            )}


            {!loading &&
              !error &&
              companies.length === 0 && (

                <div className="company-state">
                  No companies found.
                </div>

            )}


            {!loading &&
              !error &&
              companies.length > 0 && (

                <section className="company-grid">

                  {companies.map(
                    (company) => (

                      <CompanyCard
                        key={
                          company.company_id
                        }

                        company={company}

                        onClick={() =>
                          goTo(
                            `/companies/${company.company_id}`
                          )
                        }
                      />

                    )
                  )}

                </section>

            )}

          </div>

        </main>

      </div>

    </div>
  );
}


// =====================================================
// COMPANY CARD
// =====================================================

function CompanyCard({
  company,
  onClick,
}) {

  const companyName =
    company.name ||
    company.company_name ||
    "Unnamed company";


  const status =
    company.status ||
    "ACTIVE";


  const employeeCount =
    company.employee_count ??
    company.employees_count ??
    company.total_employees ??
    0;


  return (

    <button
      className="company-card"
      onClick={onClick}
    >

      <div className="company-card-top">

        <div className="company-card-icon">
          ◇
        </div>


        <span
          className={`company-status ${
            status === "ACTIVE"
              ? "company-status-active"
              : "company-status-inactive"
          }`}
        >
          {formatStatus(status)}
        </span>

      </div>


      <div className="company-card-body">

        <h3>
          {companyName}
        </h3>


        {company.email && (
          <p>
            {company.email}
          </p>
        )}


        {company.phone && (
          <p>
            {company.phone}
          </p>
        )}

      </div>


      <div className="company-card-footer">

        <div>

          <strong>
            {employeeCount}
          </strong>

          <span>
            Employees
          </span>

        </div>


        <span className="company-arrow">
          →
        </span>

      </div>

    </button>
  );
}


// =====================================================
// FORMAT STATUS
// =====================================================

function formatStatus(status) {

  return String(status)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );
}


export default CompanyPage;