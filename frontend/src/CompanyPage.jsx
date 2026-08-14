
import "./CompanyPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

import homeIcon from "./assets/home.png";
import officeIcon from "./assets/office-building.png";
import teamIcon from "./assets/team.png";

const API_URL = "https://employee-management-system-cb7g.onrender.com/api";

function CompanyPage() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // CRUD state
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const { user } = useAuth();

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "ACTIVE",
  });

  // =====================================================
  // LOAD COMPANIES
  // =====================================================

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token is required");
      }

      const response = await fetch(
        `${API_URL}/companies`,
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
          data?.message || "Failed to fetch companies"
        );
      }

      const companyList = Array.isArray(data)
        ? data
        : data?.companies || [];

      setCompanies(companyList);
    } catch (err) {
      console.error("Company error:", err);

      setError(
        err.message || "Failed to load companies"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // =====================================================
  // FORM HANDLING
  // =====================================================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingCompany(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "ACTIVE",
    });

    setError("");
    setMessage("");

    setShowModal(true);
  };

  const openEditModal = (company) => {
    setEditingCompany(company);

    setForm({
      name: company.name || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      status: company.status || "ACTIVE",
    });

    setError("");
    setMessage("");

    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCompany(null);
  };

  // =====================================================
  // CREATE / UPDATE COMPANY
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setMessageType("error");
      setMessage("Company name is required.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token is required"
        );
      }

      const isEditing = Boolean(editingCompany);

      const url = isEditing
        ? `${API_URL}/companies/${editingCompany.company_id}`
        : `${API_URL}/companies`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: form.phone.trim() || null,
          address: form.address.trim() || null,
          status: form.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Failed to ${
              isEditing ? "update" : "create"
            } company`
        );
      }

      setShowModal(false);
      setEditingCompany(null);

      setMessageType("success");
      setMessage(
        data?.message ||
          `Company ${
            isEditing ? "updated" : "created"
          } successfully.`
      );

      await loadCompanies();

      // Automatically hide success message
      setTimeout(() => {
        setMessage("");
      }, 3500);
    } catch (err) {
      console.error("Save company error:", err);

      setMessageType("error");
      setMessage(
        err.message ||
          "Something went wrong while saving the company."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DEACTIVATE COMPANY
  // =====================================================

  const handleDeactivate = async (company) => {
    const companyName =
      company.name ||
      company.company_name ||
      "this company";

    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${companyName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token is required"
        );
      }

      const response = await fetch(
        `${API_URL}/companies/${company.company_id}`,
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
            "Failed to deactivate company"
        );
      }

      setMessageType("success");
      setMessage(
        data?.message ||
          "Company deactivated successfully."
      );

      await loadCompanies();

      setTimeout(() => {
        setMessage("");
      }, 3500);
    } catch (err) {
      console.error(
        "Deactivate company error:",
        err
      );

      setMessageType("error");
      setMessage(
        err.message ||
          "Failed to deactivate company."
      );
    }
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="company-page">

      <div className="company-bg-glow company-glow-purple"></div>

      <div className="company-bg-glow company-glow-blue"></div>

      <div className="company-shell">

        {/* MOBILE OVERLAY */}

        {mobileMenuOpen && (
          <div
            className="company-mobile-overlay"
            onClick={closeMobileMenu}
          />
        )}

        {/* SIDEBAR */}

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
                type="button"
                className="company-nav-item"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/");
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
                type="button"
                className="company-nav-item"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/employees");
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
                type="button"
                className="company-nav-item active"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/companies");
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
            type="button"
            className="company-logout"
            onClick={logout}
          >
            ↪
            <span>
              Log out
            </span>
          </button>

        </aside>

        {/* MAIN */}

        <main className="company-main">

          {/* TOPBAR */}

          <header className="company-topbar">

            <button
              type="button"
              className="company-menu-button"
              onClick={() =>
                setMobileMenuOpen(
                  !mobileMenuOpen
                )
              }
            >
              {mobileMenuOpen ? "×" : "☰"}
            </button>

            <div></div>

            <div className="company-user">

              <div className="company-user-info">

                <strong>
                  {user?.name || "User"}
                </strong>

                <small>
                  {user?.role || "Employee"}
                </small>

              </div>

              <div className="company-avatar">
                {userInitial}
              </div>

            </div>

          </header>

          {/* CONTENT */}

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
                type="button"
                className="add-company-button"
                onClick={openCreateModal}
              >
                + Add company
              </button>

            </section>

            {/* MESSAGE */}

            {message && (
              <div
                className={`company-message ${
                  messageType === "error"
                    ? "company-message-error"
                    : "company-message-success"
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

            {/* LOADING */}

            {loading && (
              <div className="company-state">
                Loading companies...
              </div>
            )}

            {/* ERROR */}

            {error && !loading && (
              <div className="company-state company-error">
                {error}
              </div>
            )}

            {/* EMPTY */}

            {!loading &&
              !error &&
              companies.length === 0 && (
                <div className="company-state">
                  No companies found.
                </div>
              )}

            {/* COMPANY LIST */}

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
                          navigate(
                            `/companies/${company.company_id}`
                          )
                        }
                        onEdit={() =>
                          openEditModal(company)
                        }
                        onDeactivate={() =>
                          handleDeactivate(
                            company
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

      {/* =====================================================
          COMPANY MODAL
      ===================================================== */}

      {showModal && (
        <div
          className="company-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeModal();
            }
          }}
        >

          <div className="company-modal">

            <div className="company-modal-header">

              <div>
                <p>
                  {editingCompany
                    ? "EDIT COMPANY"
                    : "NEW COMPANY"}
                </p>

                <h2>
                  {editingCompany
                    ? "Edit company"
                    : "Add company"}
                </h2>

                <span>
                  {editingCompany
                    ? "Update the company information below."
                    : "Enter the details for the new company."}
                </span>
              </div>

              <button
                type="button"
                className="company-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>

            </div>

            <form
              className="company-form"
              onSubmit={handleSubmit}
            >

              <div className="company-form-field">

                <label>
                  Company name
                  <span>*</span>
                </label>

                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                  required
                />

              </div>

              <div className="company-form-grid">

                <div className="company-form-field">

                  <label>
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="company@example.com"
                  />

                </div>

                <div className="company-form-field">

                  <label>
                    Phone
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="+94 77 123 4567"
                  />

                </div>

              </div>

              <div className="company-form-field">

                <label>
                  Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  placeholder="Enter company address"
                  rows="3"
                />

              </div>

              {editingCompany && (
                <div className="company-form-field">

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

              <div className="company-form-actions">

                <button
                  type="button"
                  className="company-cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="company-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingCompany
                    ? "Save changes"
                    : "Create company"}
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
// COMPANY CARD
// =====================================================

function CompanyCard({
  company,
  onClick,
  onEdit,
  onDeactivate,
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

  const isActive =
    String(status).toUpperCase() ===
    "ACTIVE";

  return (
    <article className="company-card">

      <div className="company-card-top">

        <button
          type="button"
          className="company-card-main"
          onClick={onClick}
        >

          <div className="company-card-icon">
             <img
                src={officeIcon}
                alt="Company"
              />
          </div>

          <span
            className={`company-status ${
              isActive
                ? "company-status-active"
                : "company-status-inactive"
            }`}
          >
            {formatStatus(status)}
          </span>

        </button>

      </div>

      <button
        type="button"
        className="company-card-content"
        onClick={onClick}
      >

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

      {/* CRUD ACTIONS */}

      <div className="company-card-actions">

        <button
          type="button"
          className="company-edit-button"
          onClick={onEdit}
        >
          Edit
        </button>

        {isActive && (
          <button
            type="button"
            className="company-deactivate-button"
            onClick={onDeactivate}
          >
            Deactivate
          </button>
        )}

      </div>

    </article>
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

