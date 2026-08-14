
import "./EmployeesPage.css";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import homeIcon from "./assets/home.png";
import officeIcon from "./assets/office-building.png";
import teamIcon from "./assets/team.png";

const API_URL = "http://localhost:5000/api";

function EmployeesPage() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");

  const [sortBy, setSortBy] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 10,
  });

  /*
   * Load companies
   */
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token is required");
        }

        const response = await fetch(
          `${API_URL}/companies`,
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
            data?.message || "Failed to load companies"
          );
        }

        const companyList = Array.isArray(data)
          ? data
          : Array.isArray(data?.companies)
          ? data.companies
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setCompanies(companyList);
      } catch (err) {
        console.error("Companies error:", err);
      }
    };

    loadCompanies();
  }, []);

  /*
   * Load departments
   */
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token is required");
        }

        const response = await fetch(
          `${API_URL}/departments`,
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
            data?.message || "Failed to load departments"
          );
        }

        const departmentList = Array.isArray(data)
          ? data
          : Array.isArray(data?.departments)
          ? data.departments
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setDepartments(departmentList);
      } catch (err) {
        console.error("Departments error:", err);
      }
    };

    loadDepartments();
  }, []);

  /*
   * Load employees
   */
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token is required");
        }

        const params = new URLSearchParams();

        params.set("page", page);
        params.set("limit", limit);

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (companyId) {
          params.set("company_id", companyId);
        }

        if (departmentId) {
          params.set("department_id", departmentId);
        }

        if (status) {
          params.set("status", status);
        }

        params.set("sort_by", sortBy);
        params.set("sort_order", sortOrder);

        const response = await fetch(
          `${API_URL}/employees?${params.toString()}`,
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
            total_pages: 1,
            total_items: 0,
            per_page: limit,
          }
        );
      } catch (err) {
        console.error("Employees error:", err);

        setError(
          err.message || "Failed to load employees"
        );

        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [
    page,
    limit,
    search,
    companyId,
    departmentId,
    status,
    sortBy,
    sortOrder,
  ]);

  /*
   * Reset page when filters change
   */
  useEffect(() => {
    setPage(1);
  }, [
    search,
    companyId,
    departmentId,
    status,
    sortBy,
    sortOrder,
  ]);

  /*
   * Only show departments belonging to selected company
   */
  const visibleDepartments = useMemo(() => {
    if (!companyId) {
      return departments;
    }

    return departments.filter((department) => {
      const departmentCompanyId =
        department.company_id ??
        department.companyId;

      return String(departmentCompanyId) ===
        String(companyId);
    });
  }, [departments, companyId]);

  const goTo = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCompanyChange = (value) => {
    setCompanyId(value);

    /*
     * Department may no longer belong to the
     * newly selected company.
     */
    setDepartmentId("");
  };

  const handleSortChange = (value) => {
    if (value === "name_asc") {
      setSortBy("first_name");
      setSortOrder("asc");
      return;
    }

    if (value === "name_desc") {
      setSortBy("first_name");
      setSortOrder("desc");
      return;
    }

    if (value === "joining_asc") {
      setSortBy("joining_date");
      setSortOrder("asc");
      return;
    }

    if (value === "joining_desc") {
      setSortBy("joining_date");
      setSortOrder("desc");
    }
  };

  const currentSort = () => {
    if (
      sortBy === "first_name" &&
      sortOrder === "asc"
    ) {
      return "name_asc";
    }

    if (
      sortBy === "first_name" &&
      sortOrder === "desc"
    ) {
      return "name_desc";
    }

    if (
      sortBy === "joining_date" &&
      sortOrder === "asc"
    ) {
      return "joining_asc";
    }

    return "joining_desc";
  };

  const clearFilters = () => {
    setSearch("");
    setCompanyId("");
    setDepartmentId("");
    setStatus("");
    setSortBy("first_name");
    setSortOrder("asc");
    setPage(1);
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

  const getInitials = (employee) => {
    const first =
      employee.first_name?.charAt(0) || "";

    const last =
      employee.last_name?.charAt(0) || "";

    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="employees-app">

      {mobileMenuOpen && (
        <div
          className="employees-mobile-overlay"
          onClick={() =>
            setMobileMenuOpen(false)
          }
        />
      )}

      <div className="employees-shell">

        {/* SIDEBAR */}

        <aside
          className={`employees-sidebar ${
            mobileMenuOpen
              ? "employees-sidebar-open"
              : ""
          }`}
        >
          <div className="employees-sidebar-top">

            <div className="employees-logo">
              <strong>
                EMPLOYEE
                <br />
                MANAGEMENT SYSTEM
              </strong>
            </div>

            <nav className="employees-navigation">

              <button
                type="button"
                className="employees-nav-item"
                onClick={() => goTo("/")}
              >
                <span className="employees-nav-icon">
                  <img
                    src={homeIcon}
                    alt=""
                  />
                </span>

                Dashboard
              </button>

              <button
                type="button"
                className="employees-nav-item active"
                onClick={() =>
                  goTo("/employees")
                }
              >
                <span className="employees-nav-icon">
                  <img
                    src={teamIcon}
                    alt=""
                  />
                </span>

                Employees
              </button>

              <button
                type="button"
                className="employees-nav-item"
                onClick={() =>
                  goTo("/companies")
                }
              >
                <span className="employees-nav-icon">
                  <img
                    src={officeIcon}
                    alt=""
                  />
                </span>

                Companies
              </button>

            </nav>
          </div>

          <div className="employees-sidebar-bottom">

            <button
              type="button"
              className="employees-logout"
              onClick={logout}
            >
              <span>↪</span>
              <span>Log out</span>
            </button>

          </div>
        </aside>

        {/* MAIN */}

        <main className="employees-main">

          {/* TOPBAR */}

          <header className="employees-topbar">

            <button
              type="button"
              className="employees-menu-button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
            >
              {mobileMenuOpen ? "×" : "☰"}
            </button>

            <div className="employees-topbar-spacer" />

            <div className="employees-user">

              <div className="employees-user-info">
                <strong>
                  Rahma Nizer
                </strong>

                <small>
                  Administrator
                </small>
              </div>

              <div className="employees-avatar">
                RN
              </div>

            </div>

          </header>

          {/* CONTENT */}

          <div className="employees-content">

            <div className="employees-page-heading">

              <div>
                <p className="employees-page-label">
                  DIRECTORY
                </p>

                <h1>
                  Employees
                </h1>

                <p>
                  Manage and view employees
                  across all companies.
                </p>
              </div>

              <div className="employees-total">
                <strong>
                  {pagination.total_items}
                </strong>

                <span>
                  Total employees
                </span>
              </div>

            </div>

            {/* FILTER BAR */}

            <section className="employees-filter-card">

              <div className="employees-search">

                <span className="employees-search-icon">
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search employees by name or email"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>

              <div className="employees-filter-row">

                <select
                  value={companyId}
                  onChange={(event) =>
                    handleCompanyChange(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    All companies
                  </option>

                  {companies.map(
                    (company) => (
                      <option
                        key={
                          company.company_id ??
                          company.id
                        }
                        value={
                          company.company_id ??
                          company.id
                        }
                      >
                        {company.company_name ??
                          company.name}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={departmentId}
                  onChange={(event) =>
                    setDepartmentId(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    All departments
                  </option>

                  {visibleDepartments.map(
                    (department) => (
                      <option
                        key={
                          department.department_id ??
                          department.id
                        }
                        value={
                          department.department_id ??
                          department.id
                        }
                      >
                        {department.department_name ??
                          department.name}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    All statuses
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="TERMINATED">
                    Terminated
                  </option>
                </select>

                <select
                  value={currentSort()}
                  onChange={(event) =>
                    handleSortChange(
                      event.target.value
                    )
                  }
                >
                  <option value="name_asc">
                    Name A–Z
                  </option>

                  <option value="name_desc">
                    Name Z–A
                  </option>

                  <option value="joining_desc">
                    Newest joined
                  </option>

                  <option value="joining_asc">
                    Oldest joined
                  </option>
                </select>

                <button
                  type="button"
                  className="employees-clear-button"
                  onClick={clearFilters}
                >
                  Clear
                </button>

              </div>

            </section>

            {error && (
              <div className="employees-error">
                {error}
              </div>
            )}

            {/* TABLE */}

            <section className="employees-list-card">

              <div className="employees-list-header">

                <div>
                  <h2>
                    Employee Directory
                  </h2>

                  <p>
                    {pagination.total_items}{" "}
                    employees found
                  </p>
                </div>

              </div>

              {loading ? (

                <div className="employees-state">
                  Loading employees...
                </div>

              ) : employees.length === 0 ? (

                <div className="employees-state">

                  <div>
                    <strong>
                      No employees found
                    </strong>

                    <p>
                      Try changing your
                      search or filters.
                    </p>
                  </div>

                </div>

              ) : (

                <div className="employees-table-wrapper">

                  <table className="employees-table">

                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Company</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Joining Date</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>

                      {employees.map(
                        (employee) => {

                          const active =
                            String(
                              employee.status ||
                                ""
                            ).toLowerCase() ===
                            "active";

                          return (
                            <tr
                              key={
                                employee.employee_id
                              }
                              onClick={() =>
                                navigate(
                                  `/employees/${employee.employee_id}`
                                )
                              }
                            >

                              <td>

                                <div className="employees-person">

                                  <div className="employees-person-avatar">
                                    {getInitials(
                                      employee
                                    )}
                                  </div>

                                  <div>
                                    <strong>
                                      {
                                        employee.first_name
                                      }{" "}
                                      {
                                        employee.last_name
                                      }
                                    </strong>

                                    <small>
                                      {
                                        employee.email
                                      }
                                    </small>
                                  </div>

                                </div>

                              </td>

                              <td>
                                <span className="employees-company-name">
                                  {
                                    employee.company_name ||
                                      "—"
                                  }
                                </span>
                              </td>

                              <td>
                                {
                                  employee.department_name ||
                                    "—"
                                }
                              </td>

                              <td>

                                <span
                                  className={`employees-status ${
                                    active
                                      ? "active"
                                      : "terminated"
                                  }`}
                                >
                                  {
                                    employee.status ||
                                      "—"
                                  }
                                </span>

                              </td>

                              <td>
                                {formatDate(
                                  employee.joining_date
                                )}
                              </td>

                              <td>

                                <button
                                  type="button"
                                  className="employees-view-button"
                                  onClick={(
                                    event
                                  ) => {
                                    event.stopPropagation();

                                    navigate(
                                      `/employees/${employee.employee_id}`
                                    );
                                  }}
                                >
                                  View
                                </button>

                              </td>

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>
              )}

              {/* PAGINATION */}

              {!loading &&
                pagination.total_pages > 1 && (

                  <div className="employees-pagination">

                    <button
                      type="button"
                      disabled={
                        page === 1
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
                            Math.max(
                              current - 1,
                              1
                            )
                        )
                      }
                    >
                      ← Previous
                    </button>

                    <div className="employees-page-numbers">

                      {Array.from(
                        {
                          length:
                            pagination.total_pages,
                        },
                        (_, index) =>
                          index + 1
                      )
                        .filter(
                          (pageNumber) => {
                            if (
                              pagination.total_pages <=
                              7
                            ) {
                              return true;
                            }

                            return (
                              pageNumber ===
                                1 ||
                              pageNumber ===
                                pagination.total_pages ||
                              Math.abs(
                                pageNumber -
                                  page
                              ) <= 1
                            );
                          }
                        )
                        .map(
                          (pageNumber) => (
                            <button
                              key={
                                pageNumber
                              }
                              type="button"
                              className={
                                pageNumber ===
                                page
                                  ? "current"
                                  : ""
                              }
                              onClick={() =>
                                setPage(
                                  pageNumber
                                )
                              }
                            >
                              {
                                pageNumber
                              }
                            </button>
                          )
                        )}

                    </div>

                    <button
                      type="button"
                      disabled={
                        page ===
                        pagination.total_pages
                      }
                      onClick={() =>
                        setPage(
                          (current) =>
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

export default EmployeesPage;
