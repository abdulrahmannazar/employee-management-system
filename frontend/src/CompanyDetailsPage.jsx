
import "./CompanyDetailsPage.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import homeIcon from "./assets/home.png";
import officeIcon from "./assets/office-building.png";
import teamIcon from "./assets/team.png";

const API_URL = "https://employee-management-system-cb7g.onrender.com/api";

function CompanyDetailsPage() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  const [company, setCompany] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // CRUD
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [form, setForm] = useState({
    name: "",
    status: "ACTIVE",
  });

  // =====================================================
  // LOAD COMPANY + DEPARTMENTS
  // =====================================================

  const loadCompany = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token is required");
      }

      const response = await fetch(
        `${API_URL}/departments/company/${companyId}`,
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

  useEffect(() => {
    if (companyId) {
      loadCompany();
    }
  }, [companyId]);

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
  // FORM
  // =====================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingDepartment(null);

    setForm({
      name: "",
      status: "ACTIVE",
    });

    setMessage("");

    setShowModal(true);
  };

  const openEditModal = (department) => {
    setEditingDepartment(department);

    setForm({
      name: department.name || "",
      status: department.status || "ACTIVE",
    });

    setMessage("");

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingDepartment(null);
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessageType("error");
      setMessage("Department name is required.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token is required");
      }

      const isEditing = Boolean(editingDepartment);

      const url = isEditing
        ? `${API_URL}/departments/${editingDepartment.department_id}`
        : `${API_URL}/departments`;

      const method = isEditing ? "PUT" : "POST";

      const body = isEditing
        ? {
            name: form.name.trim(),
            status: form.status,
          }
        : {
            name: form.name.trim(),
            company_id: Number(companyId),
            status: "ACTIVE",
          };

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } department`
        );
      }

      setShowModal(false);
      setEditingDepartment(null);

      setMessageType("success");
      setMessage(
        data?.message ||
          `Department ${
            isEditing ? "updated" : "created"
          } successfully.`
      );

      await loadCompany();

      setTimeout(() => {
        setMessage("");
      }, 3500);
    } catch (err) {
      console.error("Department save error:", err);

      setMessageType("error");
      setMessage(
        err.message ||
          "Something went wrong while saving the department."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DEACTIVATE
  // =====================================================

  const handleDeactivate = async (department) => {
    const departmentName =
      department.name || "this department";

    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${departmentName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token is required");
      }

      const response = await fetch(
        `${API_URL}/departments/${department.department_id}`,
        {
          method: "DELETE",
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
            "Failed to deactivate department"
        );
      }

      setMessageType("success");
      setMessage(
        data?.message ||
          "Department deactivated successfully."
      );

      await loadCompany();

      setTimeout(() => {
        setMessage("");
      }, 3500);
    } catch (err) {
      console.error(
        "Department deactivate error:",
        err
      );

      setMessageType("error");
      setMessage(
        err.message ||
          "Failed to deactivate department."
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="company-details-app">

      {/* MOBILE OVERLAY */}

      {mobileMenuOpen && (
        <div
          className="company-details-mobile-overlay"
          onClick={() =>
            setMobileMenuOpen(false)
          }
        />
      )}

      <div className="company-details-shell">

        {/* SIDEBAR */}

        <aside
          className={`company-details-sidebar ${
            mobileMenuOpen
              ? "company-details-sidebar-open"
              : ""
          }`}
        >

          <div className="company-details-sidebar-top">

            <div className="company-details-logo">
              <strong>
                EMPLOYEE
                <br />
                MANAGEMENT SYSTEM
              </strong>
            </div>

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
                onClick={() =>
                  goTo("/employees")
                }
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
                onClick={() =>
                  goTo("/companies")
                }
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

          <div className="company-details-sidebar-bottom">

            <button
              type="button"
              className="company-details-logout"
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

        <main className="company-details-main">

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

            <div className="company-details-topbar-left"></div>

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

          <div className="company-details-content">

            <button
              type="button"
              className="company-details-back"
              onClick={() =>
                navigate("/companies")
              }
            >
              ← Back to companies
            </button>

            {/* LOADING */}

            {loading && (
              <div className="company-details-state">
                Loading company...
              </div>
            )}

            {/* ERROR */}

            {!loading && error && (
              <div className="company-details-state company-details-error">
                {error}
              </div>
            )}

            {/* COMPANY */}

            {!loading &&
              !error &&
              company && (
                <>

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

                  {/* MESSAGE */}

                  {message && (
                    <div
                      className={`company-details-message ${
                        messageType === "error"
                          ? "company-details-message-error"
                          : "company-details-message-success"
                      }`}
                    >
                      <span>
                        {messageType === "error"
                          ? "!"
                          : "✓"}
                      </span>

                      <p>
                        {message}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setMessage("")
                        }
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {/* DEPARTMENTS */}

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

                      <button
                        type="button"
                        className="company-details-add-button"
                        onClick={
                          openCreateModal
                        }
                      >
                        + Add department
                      </button>

                    </div>

                    {departments.length === 0 ? (

                      <div className="company-details-empty">
                        <div>
                          <strong>
                            No departments yet
                          </strong>

                          <span>
                            Create the first department
                            for this company.
                          </span>

                          <button
                            type="button"
                            onClick={
                              openCreateModal
                            }
                          >
                            + Add department
                          </button>
                        </div>
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

                            const isActive =
                              String(status)
                                .toUpperCase() ===
                              "ACTIVE";

                            return (
                              <article
                                key={
                                  department.department_id
                                }
                                className="company-details-department-card-wrapper"
                              >

                                <button
                                  type="button"
                                  className="company-details-department-card"
                                  onClick={() =>
                                    navigate(
                                      `/companies/${companyId}/departments/${department.department_id}`
                                    )
                                  }
                                >

                                  <div className="company-details-department-icon">
                                    {name
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div className="company-details-department-info">

                                    <h3>
                                      {name}
                                    </h3>

                                    <span
                                      className={`company-details-status ${
                                        isActive
                                          ? "active"
                                          : "inactive"
                                      }`}
                                    >
                                      {formatStatus(
                                        status
                                      )}
                                    </span>

                                  </div>

                                  <span className="company-details-arrow">
                                    →
                                  </span>

                                </button>

                                {/* CRUD */}

                                <div className="company-details-department-actions">

                                  <button
                                    type="button"
                                    className="company-details-edit-button"
                                    onClick={() =>
                                      openEditModal(
                                        department
                                      )
                                    }
                                  >
                                    Edit
                                  </button>

                                  {isActive && (
                                    <button
                                      type="button"
                                      className="company-details-deactivate-button"
                                      onClick={() =>
                                        handleDeactivate(
                                          department
                                        )
                                      }
                                    >
                                      Deactivate
                                    </button>
                                  )}

                                </div>

                              </article>
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

      {/* =====================================================
          DEPARTMENT MODAL
      ===================================================== */}

      {showModal && (
        <div
          className="company-details-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="company-details-modal">

            <div className="company-details-modal-header">

              <div>

                <p>
                  {editingDepartment
                    ? "EDIT DEPARTMENT"
                    : "NEW DEPARTMENT"}
                </p>

                <h2>
                  {editingDepartment
                    ? "Edit department"
                    : "Add department"}
                </h2>

                <span>
                  {editingDepartment
                    ? "Update the department information below."
                    : "Create a department for this company."}
                </span>

              </div>

              <button
                type="button"
                className="company-details-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>

            </div>

            <form
              className="company-details-form"
              onSubmit={handleSubmit}
            >

              <div className="company-details-form-field">

                <label>
                  Department name
                  <span>*</span>
                </label>

                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Engineering"
                  required
                />

              </div>

              {editingDepartment && (
                <div className="company-details-form-field">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleInputChange}
                  >
                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="INACTIVE">
                      Inactive
                    </option>
                  </select>

                </div>
              )}

              <div className="company-details-form-company">

                <span>
                  Company
                </span>

                <strong>
                  {company.name ||
                    company.company_name}
                </strong>

              </div>

              <div className="company-details-form-actions">

                <button
                  type="button"
                  className="company-details-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="company-details-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingDepartment
                    ? "Save changes"
                    : "Create department"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}


// =====================================================
// HELPERS
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

export default CompanyDetailsPage;
