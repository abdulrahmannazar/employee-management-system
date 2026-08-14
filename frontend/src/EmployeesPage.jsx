
import "./EmployeesPage.css";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext.jsx";


import homeIcon from "./assets/home.png";
import officeIcon from "./assets/office-building.png";
import teamIcon from "./assets/team.png";

const API_URL = "https://employee-management-system-cb7g.onrender.com/api";

function EmployeesPage() {
  const navigate = useNavigate();
  
  const { user } = useAuth();


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

  

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    per_page: 10,
  });

  // =====================================================
  // CRUD STATE
  // =====================================================

  const [showEmployeeModal, setShowEmployeeModal] =
    useState(false);

  const [savingEmployee, setSavingEmployee] =
    useState(false);

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [crudMessage, setCrudMessage] = useState("");
  const [crudMessageType, setCrudMessageType] =
    useState("success");

  const emptyEmployeeForm = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company_id: "",
    department_id: "",
    manager_id: "",
    joining_date: "",
    status: "ACTIVE",
  };

  const [employeeForm, setEmployeeForm] =
    useState(emptyEmployeeForm);

  // =====================================================
  // LOAD COMPANIES
  // =====================================================

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token is required"
          );
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
            data?.message ||
              "Failed to load companies"
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
        console.error(
          "Companies error:",
          err
        );
      }
    };

    loadCompanies();
  }, []);

  // =====================================================
  // LOAD DEPARTMENTS
  // =====================================================

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token is required"
          );
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
            data?.message ||
              "Failed to load departments"
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
        console.error(
          "Departments error:",
          err
        );
      }
    };

    loadDepartments();
  }, []);

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token is required"
          );
        }

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set(
            "search",
            search.trim()
          );
        }

        if (companyId) {
          params.set(
            "company_id",
            companyId
          );
        }

        if (departmentId) {
          params.set(
            "department_id",
            departmentId
          );
        }

        if (status) {
          params.set(
            "status",
            status
          );
        }

        params.set("sort", sortBy);
        params.set("order", sortOrder);
        params.set("page", page);
        params.set("limit", limit);

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
            data?.message ||
              "Failed to load employees"
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
        console.error(
          "Employees error:",
          err
        );

        setError(
          err.message ||
            "Failed to load employees"
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

  // =====================================================
  // RESET PAGE WHEN FILTERS CHANGE
  // =====================================================

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

  // =====================================================
  // VISIBLE DEPARTMENTS
  // =====================================================

  const visibleDepartments = useMemo(() => {
    if (!employeeForm.company_id) {
      return departments;
    }

    return departments.filter(
      (department) => {
        const departmentCompanyId =
          department.company_id ??
          department.companyId;

        return (
          String(departmentCompanyId) ===
          String(employeeForm.company_id)
        );
      }
    );
  }, [
    departments,
    employeeForm.company_id,
  ]);

  // =====================================================
  // FILTER DEPARTMENTS
  // =====================================================

  const filterDepartments = useMemo(() => {
    if (!companyId) {
      return departments;
    }

    return departments.filter(
      (department) => {
        const departmentCompanyId =
          department.company_id ??
          department.companyId;

        return (
          String(departmentCompanyId) ===
          String(companyId)
        );
      }
    );
  }, [
    departments,
    companyId,
  ]);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // =====================================================
  // FILTER HANDLERS
  // =====================================================

  const handleCompanyChange = (value) => {
    setCompanyId(value);
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

  // =====================================================
  // FORM
  // =====================================================

  const handleEmployeeFormChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setEmployeeForm(
      (current) => ({
        ...current,
        [name]: value,
        ...(name === "company_id"
          ? {
              department_id: "",
              manager_id: "",
            }
          : {}),
      })
    );
  };

  const openCreateEmployee = () => {
    setEditingEmployee(null);

    setEmployeeForm(
      emptyEmployeeForm
    );

    setCrudMessage("");

    setShowEmployeeModal(true);
  };

  const openEditEmployee = (
    employee
  ) => {
    setEditingEmployee(employee);

    setEmployeeForm({
      first_name:
        employee.first_name || "",
      last_name:
        employee.last_name || "",
      email:
        employee.email || "",
      phone:
        employee.phone || "",
      company_id:
        employee.company_id
          ? String(employee.company_id)
          : "",
      department_id:
        employee.department_id
          ? String(
              employee.department_id
            )
          : "",
      manager_id:
        employee.manager_id
          ? String(employee.manager_id)
          : "",
      joining_date:
        employee.joining_date
          ? String(
              employee.joining_date
            ).split("T")[0]
          : "",
      status:
        employee.status || "ACTIVE",
    });

    setCrudMessage("");

    setShowEmployeeModal(true);
  };

  const closeEmployeeModal = () => {
    if (savingEmployee) {
      return;
    }

    setShowEmployeeModal(false);
    setEditingEmployee(null);
  };

  // =====================================================
  // CREATE / UPDATE EMPLOYEE
  // =====================================================

  const handleEmployeeSubmit = async (
    event
  ) => {
    event.preventDefault();

    setCrudMessage("");

    if (
      !employeeForm.first_name.trim() ||
      !employeeForm.last_name.trim() ||
      !employeeForm.email.trim()
    ) {
      setCrudMessageType("error");
      setCrudMessage(
        "First name, last name and email are required."
      );
      return;
    }

    if (
      !employeeForm.company_id ||
      !employeeForm.department_id
    ) {
      setCrudMessageType("error");
      setCrudMessage(
        "Company and department are required."
      );
      return;
    }

    if (!employeeForm.joining_date) {
      setCrudMessageType("error");
      setCrudMessage(
        "Joining date is required."
      );
      return;
    }

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    if (
      employeeForm.joining_date >
      today
    ) {
      setCrudMessageType("error");
      setCrudMessage(
        "Joining date cannot be in the future."
      );
      return;
    }

    try {
      setSavingEmployee(true);

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        throw new Error(
          "Authentication token is required"
        );
      }

      const isEditing =
        Boolean(editingEmployee);

      const url = isEditing
        ? `${API_URL}/employees/${editingEmployee.employee_id}`
        : `${API_URL}/employees`;

      const method = isEditing
        ? "PUT"
        : "POST";

      const body = {
        first_name:
          employeeForm.first_name.trim(),

        last_name:
          employeeForm.last_name.trim(),

        email:
          employeeForm.email.trim(),

        phone:
          employeeForm.phone.trim(),

        company_id:
          Number(
            employeeForm.company_id
          ),

        department_id:
          Number(
            employeeForm.department_id
          ),

        manager_id:
          employeeForm.manager_id
            ? Number(
                employeeForm.manager_id
              )
            : null,

        joining_date:
          employeeForm.joining_date,

        status:
          employeeForm.status,
      };

      const response =
        await fetch(url, {
          method,

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            body
          ),
        });

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to ${
              isEditing
                ? "update"
                : "create"
            } employee`
        );
      }

      setShowEmployeeModal(
        false
      );

      setEditingEmployee(null);

      setCrudMessageType(
        "success"
      );

      setCrudMessage(
        data?.message ||
          `Employee ${
            isEditing
              ? "updated"
              : "created"
          } successfully.`
      );

      /*
       * Reload current page.
       */
      setPage(
        (current) => current
      );

      // Small delay so the current
      // page reloads naturally.
      window.setTimeout(
        () => {
          window.location.reload();
        },
        400
      );
    } catch (err) {
      console.error(
        "Employee save error:",
        err
      );

      setCrudMessageType(
        "error"
      );

      setCrudMessage(
        err.message ||
          "Failed to save employee."
      );
    } finally {
      setSavingEmployee(false);
    }
  };

  // =====================================================
  // TERMINATE EMPLOYEE
  // =====================================================

  const handleTerminateEmployee = async (
    employee
  ) => {
    const fullName =
      `${employee.first_name || ""} ${
        employee.last_name || ""
      }`.trim();

    const confirmed =
      window.confirm(
        `Are you sure you want to terminate ${
          fullName ||
          "this employee"
        }?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        throw new Error(
          "Authentication token is required"
        );
      }

      const response =
        await fetch(
          `${API_URL}/employees/${employee.employee_id}`,
          {
            method: "DELETE",

            headers: {
              Authorization: `Bearer ${token}`,
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
            "Failed to terminate employee"
        );
      }

      setCrudMessageType(
        "success"
      );

      setCrudMessage(
        data?.message ||
          "Employee terminated successfully."
      );

      /*
       * Reload the employee
       * directory.
       */
      window.setTimeout(
        () => {
          window.location.reload();
        },
        400
      );
    } catch (err) {
      console.error(
        "Terminate employee error:",
        err
      );

      setCrudMessageType(
        "error"
      );

      setCrudMessage(
        err.message ||
          "Failed to terminate employee."
      );
    }
  };

  // =====================================================
  // HELPERS
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "—";
    }

    return parsed.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const getInitials = (
    employee
  ) => {
    const first =
      employee.first_name
        ?.charAt(0) || "";

    const last =
      employee.last_name
        ?.charAt(0) || "";

    return `${first}${last}`.toUpperCase();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="employees-app">

      {mobileMenuOpen && (
        <div
          className="employees-mobile-overlay"
          onClick={() =>
            setMobileMenuOpen(
              false
            )
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
                onClick={() =>
                  goTo("/")
                }
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
              <span>
                Log out
              </span>
            </button>

          </div>

        </aside>

        {/* MAIN */}

        <main className="employees-main">

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
              {mobileMenuOpen
                ? "×"
                : "☰"}
            </button>

            <div className="employees-topbar-right">
            </div>

            <div className="employees-user">

              <div className="employees-user-info">

                <strong>
                    {user?.name || "User"}
                  </strong>

                <small>
                  {user?.role || "Employee"}
                </small>

              </div>
            

              <div className="employees-avatar">
                {userInitial}
              </div>

            </div>

          </header>

          <div className="employees-content">

            {/* PAGE HEADER */}

            <section className="employees-heading">

              <div>

                <p className="employees-label">
                  EMPLOYEE DIRECTORY
                </p>

                <h1>
                  Employees
                </h1>

                <p>
                  Manage employees across
                  all companies and
                  departments.
                </p>

              </div>

              <button
                type="button"
                className="employees-add-button"
                onClick={
                  openCreateEmployee
                }
              >
                + Add employee
              </button>

            </section>

            {/* CRUD MESSAGE */}

            {crudMessage && (
              <div
                className={`employees-crud-message ${
                  crudMessageType ===
                  "error"
                    ? "error"
                    : "success"
                }`}
              >
                <span>
                  {crudMessageType ===
                  "error"
                    ? "!"
                    : "✓"}
                </span>

                <p>
                  {crudMessage}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setCrudMessage(
                      ""
                    )
                  }
                >
                  ×
                </button>
              </div>
            )}

            {/* FILTERS */}

            <section className="employees-filter-card">

              <div className="employees-search-wrapper">

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search employees by name or email"
                  className="employees-search"
                />

              </div>

              <div className="employees-filters">

                <select
                  value={companyId}
                  onChange={(event) =>
                    handleCompanyChange(
                      event.target
                        .value
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
                          company.company_id
                        }
                        value={
                          company.company_id
                        }
                      >
                        {company.name}
                      </option>
                    )
                  )}
                </select>

                <select
                  value={departmentId}
                  onChange={(event) =>
                    setDepartmentId(
                      event.target
                        .value
                    )
                  }
                >
                  <option value="">
                    All departments
                  </option>

                  {filterDepartments.map(
                    (department) => (
                      <option
                        key={
                          department.department_id
                        }
                        value={
                          department.department_id
                        }
                      >
                        {department.department_name}
                      </option>
                    )
                  )}
       
                </select>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value
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
                      event.target
                        .value
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
                  onClick={
                    clearFilters
                  }
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

            {/* EMPLOYEE TABLE */}

            <section className="employees-list-card">

              <div className="employees-list-header">

                <div>

                  <h2>
                    Employee Directory
                  </h2>

                  <p>
                    {
                      pagination.total_items
                    }{" "}
                    employees found
                  </p>

                </div>

              </div>

              {loading ? (

                <div className="employees-state">
                  Loading employees...
                </div>

              ) : employees.length ===
                0 ? (

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
                        <th>
                          Employee
                        </th>

                        <th>
                          Company
                        </th>

                        <th>
                          Department
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Joining Date
                        </th>

                        <th>
                          Actions
                        </th>
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

                                <div className="employees-row-actions">

                                  <button
                                    type="button"
                                    className="employees-edit-button"
                                    onClick={(
                                      event
                                    ) => {
                                      event.stopPropagation();

                                      openEditEmployee(
                                        employee
                                      );
                                    }}
                                  >
                                    Edit
                                  </button>

                                  {active && (
                                    <button
                                      type="button"
                                      className="employees-terminate-button"
                                      onClick={(
                                        event
                                      ) => {
                                        event.stopPropagation();

                                        handleTerminateEmployee(
                                          employee
                                        );
                                      }}
                                    >
                                      Terminate
                                    </button>
                                  )}

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

                                </div>

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
                pagination.total_pages >
                  1 && (

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
                          (
                            pageNumber
                          ) => {

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
                          (
                            pageNumber
                          ) => (

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

      {/* =====================================================
          EMPLOYEE MODAL
      ===================================================== */}

      {showEmployeeModal && (

        <div
          className="employees-modal-overlay"
          onMouseDown={(
            event
          ) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeEmployeeModal();
            }

          }}
        >

          <div className="employees-modal">

            <div className="employees-modal-header">

              <div>

                <p>
                  {editingEmployee
                    ? "EDIT EMPLOYEE"
                    : "NEW EMPLOYEE"}
                </p>

                <h2>
                  {editingEmployee
                    ? "Edit employee"
                    : "Add employee"}
                </h2>

                <span>
                  Enter the employee
                  information below.
                </span>

              </div>

              <button
                type="button"
                className="employees-modal-close"
                onClick={
                  closeEmployeeModal
                }
                disabled={
                  savingEmployee
                }
              >
                ×
              </button>

            </div>

            <form
              className="employees-form"
              onSubmit={
                handleEmployeeSubmit
              }
            >

              <div className="employees-form-grid">

                <div className="employees-form-field">

                  <label>
                    First name *
                  </label>

                  <input
                    name="first_name"
                    value={
                      employeeForm.first_name
                    }
                    onChange={
                      handleEmployeeFormChange
                    }
                    placeholder="First name"
                    required
                  />

                </div>

                <div className="employees-form-field">

                  <label>
                    Last name *
                  </label>

                  <input
                    name="last_name"
                    value={
                      employeeForm.last_name
                    }
                    onChange={
                      handleEmployeeFormChange
                    }
                    placeholder="Last name"
                    required
                  />

                </div>

                <div className="employees-form-field employees-form-full">

                  <label>
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      employeeForm.email
                    }
                    onChange={
                      handleEmployeeFormChange
                    }
                    placeholder="employee@example.com"
                    required
                  />

                </div>

                <div className="employees-form-field">

                  <label>
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={
                      employeeForm.phone
                    }
                    onChange={
                      handleEmployeeFormChange
                    }
                    placeholder="Phone number"
                  />

                </div>

                <div className="employees-form-field">

                  <label>
                    Joining date *
                  </label>

                  <input
                    type="date"
                    name="joining_date"
                    value={
                      employeeForm.joining_date
                    }
                    onChange={
                      handleEmployeeFormChange
                    }
                    max={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    required
                  />

                </div>

                <div className="employees-form-field">

                  <label>
                    Company *
                  </label>

                  <select
                    name="company_id"
                    value={
                      employeeForm.company_id
                    }
                    onChange={
                      handleEmployeeFormChange
                    }
                    required
                  >

                    <option value="">
                      Select company
                    </option>

                    {companies.map(
                      (company) => (

                        <option
                          key={
                            company.company_id
                          }
                          value={
                            company.company_id
                          }
                        >
                          {company.name}
                        </option>

                      )
                    )}

                  </select>

                </div>

                <div className="employees-form-field">

                  <label>
                    Department *
                  </label>

                  <select
                    name="department_id"
                    value={
                      employeeForm.department_id
                    }
                    onChange={
                      handleEmployeeFormChange
                    }
                    required
                    disabled={
                      !employeeForm.company_id
                    }
                  >

                    <option value="">
                      {employeeForm.company_id
                        ? "Select department"
                        : "Select company first"}
                    </option>

                    {visibleDepartments.map(
                      (department) => (

                        <option
                          key={
                            department.department_id
                          }
                          value={
                            department.department_id
                          }
                        >
                          {department.department_name}
                        </option>

                      )
                    )}
                  </select>

                </div>

                <div className="employees-form-field">

                  <label>
                    Manager
                  </label>

                  <select
                    name="manager_id"
                    value={
                      employeeForm.manager_id
                    }
                    onChange={
                      handleEmployeeFormChange
                    }
                  >

                    <option value="">
                      No manager
                    </option>

                    {employees
                      .filter(
                        (employee) =>
                          String(
                            employee.company_id
                          ) ===
                          String(
                            employeeForm.company_id
                          ) &&
                          String(
                            employee.employee_id
                          ) !==
                          String(
                            editingEmployee?.employee_id
                          ) &&
                          String(
                            employee.status
                          ).toUpperCase() ===
                          "ACTIVE"
                      )
                      .map(
                        (employee) => (

                          <option
                            key={
                              employee.employee_id
                            }
                            value={
                              employee.employee_id
                            }
                          >
                            {
                              employee.first_name
                            }{" "}
                            {
                              employee.last_name
                            }
                          </option>

                        )
                      )}

                  </select>

                </div>

                {editingEmployee && (

                  <div className="employees-form-field">

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={employeeForm.status}
                      onChange={handleEmployeeFormChange}
                    >

                      <option value="ACTIVE">
                        Active
                      </option>

                      <option value="ON_LEAVE">
                        On Leave
                      </option>

                      <option value="RESIGNED">
                        Resigned
                      </option>

                      <option value="TERMINATED">
                        Terminated
                      </option>

                    </select>

                  </div>

                )}

              </div>

              {crudMessage && (
                <div
                  className={`employees-modal-message ${
                    crudMessageType ===
                    "error"
                      ? "error"
                      : "success"
                  }`}
                >
                  {crudMessage}
                </div>
              )}

              <div className="employees-form-actions">

                <button
                  type="button"
                  className="employees-modal-cancel"
                  onClick={
                    closeEmployeeModal
                  }
                  disabled={
                    savingEmployee
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="employees-modal-save"
                  disabled={
                    savingEmployee
                  }
                >
                  {savingEmployee
                    ? "Saving..."
                    : editingEmployee
                    ? "Save changes"
                    : "Create employee"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default EmployeesPage;
