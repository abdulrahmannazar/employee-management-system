import "./DashboardPage.css";
import { useEffect, useState } from "react";

import {
  getDashboard,
  getEmployees,
  getDepartments,
} from "./services/api";

import homeIcon from "./assets/home.png";
import officeIcon from "./assets/office-building.png";
import teamIcon from "./assets/team.png";


function DashboardPage() {

  // =====================================================
  // STATE
  // =====================================================

  const [dashboard, setDashboard] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [onLeaveCount, setOnLeaveCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);
        setError("");

        // -----------------------------------------------
        // DASHBOARD SUMMARY
        // -----------------------------------------------

        const dashboardData = await getDashboard();

        console.log("Dashboard data:", dashboardData);

        setDashboard(dashboardData);


        // -----------------------------------------------
        // RECENT EMPLOYEES
        // -----------------------------------------------

        const employeeData = await getEmployees({
          page: 1,
          limit: 4,
          sort: "joining_date",
          order: "desc",
        });

        console.log("Recent employees:", employeeData);

        setRecentEmployees(
          employeeData?.employees || []
        );


        // -----------------------------------------------
        // DEPARTMENTS
        // -----------------------------------------------

        const departmentData = await getDepartments();

        console.log("Department data:", departmentData);

        const departmentList =
          Array.isArray(departmentData)
            ? departmentData
            : departmentData?.departments || [];


        // -----------------------------------------------
        // EMPLOYEE COUNT PER DEPARTMENT
        // -----------------------------------------------

        const departmentsWithCounts =
          await Promise.all(

            departmentList.map(async (department) => {

              try {

                const employeeCountData =
                  await getEmployees({
                    page: 1,
                    limit: 1,
                    department_id:
                      department.department_id,
                  });


                return {
                  ...department,

                  employee_count:
                    employeeCountData
                      ?.pagination
                      ?.total_items || 0,
                };

              } catch (departmentError) {

                console.error(
                  "Department count error:",
                  departmentError
                );

                return {
                  ...department,
                  employee_count: 0,
                };

              }

            })

          );


        setDepartments(
          departmentsWithCounts
        );


        // -----------------------------------------------
        // ON LEAVE
        // -----------------------------------------------

        try {

          const onLeaveData =
            await getEmployees({
              page: 1,
              limit: 1,
              status: "ON_LEAVE",
            });


          setOnLeaveCount(
            onLeaveData
              ?.pagination
              ?.total_items || 0
          );

        } catch (leaveError) {

          console.error(
            "On leave error:",
            leaveError
          );

          setOnLeaveCount(0);

        }

      } catch (err) {

        console.error(
          "Dashboard error:",
          err
        );

        setError(
          err.message ||
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboard();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="app">
        <div className="app-shell">
          <div className="state-screen">
            Loading dashboard...
          </div>
        </div>
      </div>
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="app">
        <div className="app-shell">
          <div className="state-screen error-state">
            Error: {error}
          </div>
        </div>
      </div>
    );

  }


  if (!dashboard) {

    return (
      <div className="app">
        <div className="app-shell">
          <div className="state-screen">
            No dashboard data available.
          </div>
        </div>
      </div>
    );

  }


  // =====================================================
  // DASHBOARD VALUES
  // =====================================================

  const totalEmployees =
    dashboard?.employees?.total_employees || 0;

  const activeEmployees =
    dashboard?.employees?.active_employees || 0;

  const totalCompanies =
    dashboard?.companies?.total_companies || 0;


  // =====================================================
  // PERCENTAGES
  // =====================================================

  const activePercentage =
    totalEmployees > 0
      ? ((activeEmployees / totalEmployees) * 100)
          .toFixed(1)
      : "0.0";


  const onLeavePercentage =
    totalEmployees > 0
      ? ((onLeaveCount / totalEmployees) * 100)
          .toFixed(1)
      : "0.0";


  // =====================================================
  // DEPARTMENT MAX
  // =====================================================

  const maxDepartmentCount =
    departments.length > 0
      ? Math.max(
          ...departments.map(
            (department) =>
              Number(
                department.employee_count || 0
              )
          )
        )
      : 0;


  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {

    window.history.pushState({}, "", path);

    window.dispatchEvent(
      new PopStateEvent("popstate")
    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="app">

      {/* Background */}
      <div className="bg-glow glow-purple"></div>
      <div className="bg-glow glow-blue"></div>


      <div className="app-shell">


        {/* =================================================
            MOBILE OVERLAY
        ================================================= */}

        {mobileMenuOpen && (
          <div
            className="mobile-overlay"
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />
        )}


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          className={`sidebar ${
            mobileMenuOpen
              ? "mobile-open"
              : ""
          }`}
        >

          <div className="sidebar-top">

            {/* Logo */}

            <div className="logo">

              <div className="logo-text">
                <strong>
                  EMPLOYEE
                  <br />
                  MANAGEMENT SYSTEM
                </strong>
              </div>

            </div>


            {/* Navigation */}

            <nav className="navigation">

              <NavItem
                icon={homeIcon}
                text="Dashboard"
                active
                onClick={() => {
                  setMobileMenuOpen(false);
                  goTo("/");
                }}
              />


              <NavItem
                icon={teamIcon}
                text="Employees"
                onClick={() => {
                  setMobileMenuOpen(false);
                  goTo("/employees");
                }}
              />


              <NavItem
                icon={officeIcon}
                text="Companies"
                onClick={() => {
                  setMobileMenuOpen(false);
                  goTo("/companies");
                }}
              />

            </nav>

          </div>


          {/* Sidebar bottom */}

          <div className="sidebar-bottom">

            <button
              className="logout-button"
              onClick={() => {
                localStorage.removeItem("token");
                goTo("/login");
              }}
            >
              ↪
              <span>
                Log out
              </span>
            </button>

          </div>

        </aside>


        {/* =================================================
            MAIN
        ================================================= */}

        <main className="main-content">


          {/* =================================================
              TOP BAR
          ================================================= */}

          <header className="topbar">

            <button
              className="menu-button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
              aria-label="Open navigation"
            >
              {mobileMenuOpen ? "×" : "☰"}
            </button>


            <div className="topbar-left">
            </div>


            <div className="topbar-right">

              <div className="user-profile">

                <div className="user-info">

                  <strong>
                    Rahma Nizer
                  </strong>

                  <small>
                    Administrator
                  </small>

                </div>


                <div className="user-avatar">
                  RN
                </div>

              </div>

            </div>

          </header>


          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="page-content">


            {/* =================================================
                WELCOME
            ================================================= */}

            <section className="welcome-section">

              <div>

                <p className="page-label">
                  EMPLOYEE MANAGEMENT DASHBOARD
                </p>

                <h1>
                  Welcome, <span>Rahma</span>
                </h1>

                <p className="welcome-description">
                  Here's what's happening across
                  your organization.
                </p>

              </div>


              <button className="date-selector">

                <span className="calendar-icon">
                  ▣
                </span>

                This month

                <span>
                  ⌄
                </span>

              </button>

            </section>


            {/* =================================================
                STATS
            ================================================= */}

            <section className="stats-grid">

              <StatCard
                icon="♙"
                label="Total employees"
                value={totalEmployees}
                type="purple"
              />


              <StatCard
                icon="✓"
                label="Active employees"
                value={activeEmployees}
                change={`${activePercentage}%`}
                description="of workforce"
                type="blue"
              />


              <StatCard
                icon="◷"
                label="On leave"
                value={onLeaveCount}
                change={`${onLeavePercentage}%`}
                description="of workforce"
                type="orange"
              />


              <StatCard
                icon="◇"
                label="Companies"
                value={totalCompanies}
                type="pink"
              />

            </section>


            {/* =================================================
                QUICK ACTIONS
                FULL WIDTH - FIXES EMPTY SPACE
            ================================================= */}

            <section className="dashboard-grid">

              <div className="quick-panel">

                <div className="panel-heading">

                  <div>

                    <h3>
                      Quick actions
                    </h3>

                    <p>
                      Common HR tasks
                    </p>

                  </div>

                  <button className="more-button">
                    •••
                  </button>

                </div>


                <div className="action-list">

                  <QuickAction
                    icon="+"
                    title="Add employee"
                    description="Create employee profile"
                    type="purple"
                  />


                  <QuickAction
                    icon="◇"
                    title="Add department"
                    description="Create new department"
                    type="blue"
                  />


                  <QuickAction
                    icon="▤"
                    title="Generate report"
                    description="View HR analytics"
                    type="pink"
                  />

                </div>

              </div>

            </section>


            {/* =================================================
                BOTTOM GRID
            ================================================= */}

            <section className="bottom-grid">


              {/* =================================================
                  RECENT EMPLOYEES
              ================================================= */}

              <div className="content-panel">

                <div className="panel-heading">

                  <div>

                    <h3>
                      Recent employees
                    </h3>

                    <p>
                      Latest people added to your
                      organization
                    </p>

                  </div>


                  <button
                    className="recent-view-all"
                    onClick={() => {
                      // navigate to employees page
                    }}
                  >
                    View all →
                </button>
                </div>


                <div className="employee-table">

                  {recentEmployees.length === 0 ? (

                    <div className="empty-message">
                      No employees found
                    </div>

                  ) : (

                    recentEmployees.map(
                      (employee) => (

                        <EmployeeRow

                          key={
                            employee.employee_id
                          }

                          initials={
                            `${
                              employee.first_name?.[0] || ""
                            }${
                              employee.last_name?.[0] || ""
                            }`
                          }

                          name={
                            `${employee.first_name || ""} ${
                              employee.last_name || ""
                            }`
                          }

                          role={
                            employee.email
                          }

                          department={
                            employee.department_name ||
                            "No department"
                          }

                          status={
                            formatStatus(
                              employee.status
                            )
                          }

                        />

                      )
                    )

                  )}

                </div>

              </div>


              {/* =================================================
                  DEPARTMENTS
              ================================================= */}

              <div className="content-panel department-panel">

                <div className="panel-heading">

                  <div>

                    <h3>
                      Departments
                    </h3>

                    <p>
                      Employee distribution
                    </p>

                  </div>

                  <button className="more-button">
                    •••
                  </button>

                </div>


                <div className="department-list">

                  {departments.length === 0 ? (

                    <div className="empty-message">
                      No departments found
                    </div>

                  ) : (

                    departments.map(
                      (department) => {

                        const count =
                          Number(
                            department.employee_count || 0
                          );


                        const percentage =
                          maxDepartmentCount > 0
                            ? Math.round(
                                (count /
                                  maxDepartmentCount) *
                                  100
                              )
                            : 0;


                        return (

                          <Department
                            key={
                              department.department_id
                            }

                            name={
                              department.name ||
                              department.department_name ||
                              "Unnamed department"
                            }

                            count={count}

                            percentage={
                              `${percentage}%`
                            }
                          />

                        );

                      }
                    )

                  )}

                </div>

              </div>

            </section>

          </div>

        </main>

      </div>

    </div>
  );
}


// =====================================================
// NAV ITEM
// =====================================================

function NavItem({
  icon,
  text,
  active,
  onClick,
}) {

  return (

    <button
      className={`nav-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >

      <span className="nav-icon">

        <img
          src={icon}
          alt=""
        />

      </span>

      <span>
        {text}
      </span>

    </button>
  );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon,
  label,
  value,
  change,
  description,
  type,
}) {

  return (

    <div className="stat-card">

      <div
        className={`stat-card-icon ${type}`}
      >
        {icon}
      </div>


      <div className="stat-card-content">

        <span className="stat-label">
          {label}
        </span>


        <strong className="stat-value">
          {value}
        </strong>


        <div className="stat-change">

          {change && (
            <span>
              {change}
            </span>
          )}

          {description}

        </div>

      </div>


      <div className="stat-menu">
        •••
      </div>

    </div>
  );
}


// =====================================================
// QUICK ACTION
// =====================================================

function QuickAction({
  icon,
  title,
  description,
  type,
}) {

  return (

    <button className="quick-action">

      <div
        className={`quick-action-icon ${type}`}
      >
        {icon}
      </div>


      <div className="quick-action-text">

        <strong>
          {title}
        </strong>

        <small>
          {description}
        </small>

      </div>


      <span className="quick-action-arrow">
        →
      </span>

    </button>
  );
}


// =====================================================
// EMPLOYEE ROW
// =====================================================

function EmployeeRow({
  initials,
  name,
  role,
  department,
  status,
}) {

  const statusClass =
    status === "Active"
      ? "status-active"
      : status === "On Leave"
      ? "status-leave"
      : "status-terminated";


  return (

    <div className="employee-row">

      <div className="employee-avatar">
        {initials}
      </div>


      <div className="employee-name">

        <strong>
          {name}
        </strong>

        <small>
          {role}
        </small>

      </div>


      <div className="employee-department">
        {department}
      </div>


      <div
        className={`employee-status ${statusClass}`}
      >
        {status}
      </div>

    </div>
  );
}


// =====================================================
// DEPARTMENT
// =====================================================

function Department({
  name,
  count,
  percentage,
}) {

  return (

    <div className="department-item">

      <div className="department-top">

        <span>
          {name}
        </span>

        <strong>
          {count}
        </strong>

      </div>


      <div className="progress-bar">

        <div
          className="progress-value"
          style={{
            width: percentage,
          }}
        />

      </div>

    </div>
  );
}


// =====================================================
// STATUS FORMATTER
// =====================================================

function formatStatus(status) {

  if (!status) {
    return "Unknown";
  }

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    );
}


export default DashboardPage;