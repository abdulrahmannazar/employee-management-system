import "./DashboardPage.css";
import homeIcon from "./assets/home.png";
import offficeIcon from "./assets/office-building.png";
import teamIcon from "./assets/team.png";

function App() {
  return (
    <div className="app">

      {/* Background glow */}
      <div className="bg-glow glow-purple"></div>
      <div className="bg-glow glow-blue"></div>

      {/* Main application shell */}
      <div className="app-shell">

        {/* ============================================
            SIDEBAR
        ============================================ */}

        <aside className="sidebar">

          <div className="sidebar-top">

            {/* Logo */}
            <div className="logo">

              

              <div className="logo-text">
                <strong>EMPLOYEE MANAGMENT SYSTEM</strong>
                
              </div>

            </div>


            {/* Navigation */}
            <nav className="navigation">

              <NavItem
                icon={homeIcon}
                text="Dashboard"
                active
              />

              <NavItem
                icon={teamIcon}
                text="Employees"
              />

              <NavItem
                icon={offficeIcon}
                text="Companies"
              />

             

             

             

              

            </nav>

          </div>


          {/* Sidebar bottom */}
          <div className="sidebar-bottom">

            


            <button className="logout-button">
              ↪
              <span>Log out</span>
            </button>

          </div>

        </aside>


        {/* ============================================
            MAIN CONTENT
        ============================================ */}

        <main className="main-content">

          {/* ============================================
              TOP BAR
          ============================================ */}

          <header className="topbar">

            <button className="menu-button">
              ☰
            </button>


            <div className="topbar-left">

              

            </div>


            <div className="topbar-right">

             

              <div className="user-profile">

                <div className="user-info">
                  <strong>Rahma Nizer</strong>
                  <small>Administrator</small>
                </div>

                <div className="user-avatar">
                  RN
                </div>

              </div>

            </div>

          </header>


          {/* ============================================
              PAGE CONTENT
          ============================================ */}

          <div className="page-content">


            {/* Welcome */}
            <section className="welcome-section">

              <div>

                <p className="page-label">
                  EMPLOYEE MANAGEMENT DASHBOARD
                </p>

                <h1>
                  Welcome, <span>Rahma</span>
                </h1>

                <p className="welcome-description">
                  Here's what's happening across your organization.
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


            {/* ============================================
                STAT CARDS
            ============================================ */}

            <section className="stats-grid">


              <StatCard
                icon="♙"
                label="Total employees"
                value="248"
                change="+12"
                description="this month"
                type="purple"
              />


              <StatCard
                icon="✓"
                label="Active employees"
                value="231"
                change="93.1%"
                description="of workforce"
                type="blue"
              />


              <StatCard
                icon="◷"
                label="On leave"
                value="17"
                change="6.9%"
                description="of workforce"
                type="orange"
              />


              <StatCard
                icon="◇"
                label="Companies"
                value="12"
                change="+2"
                description="this year"
                type="pink"
              />

            </section>


            {/* ============================================
                MAIN DASHBOARD GRID
            ============================================ */}

            <section className="dashboard-grid">


              


              {/* RIGHT QUICK ACTIONS */}
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


            {/* ============================================
                BOTTOM GRID
            ============================================ */}

            <section className="bottom-grid">


              {/* Recent employees */}
              <div className="content-panel">

                <div className="panel-heading">

                  <div>
                    <h3>
                      Recent employees
                    </h3>

                    <p>
                      Latest people added to your organization
                    </p>
                  </div>

                  <button className="view-all">
                    View all →
                  </button>

                </div>


                <div className="employee-table">

                  <EmployeeRow
                    initials="AS"
                    name="Amaya Silva"
                    role="HR Manager"
                    department="Human Resources"
                    status="Active"
                  />

                  <EmployeeRow
                    initials="KM"
                    name="Kavindu Menon"
                    role="Software Engineer"
                    department="Engineering"
                    status="Active"
                  />

                  <EmployeeRow
                    initials="DN"
                    name="Dilan Niroshan"
                    role="Financial Analyst"
                    department="Finance"
                    status="Active"
                  />

                  <EmployeeRow
                    initials="SP"
                    name="Sarah Perera"
                    role="Marketing Executive"
                    department="Marketing"
                    status="On Leave"
                  />

                </div>

              </div>


              {/* Department overview */}
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

                  <Department
                    name="Engineering"
                    count="64"
                    percentage="74%"
                  />

                  <Department
                    name="Human Resources"
                    count="32"
                    percentage="48%"
                  />

                  <Department
                    name="Finance"
                    count="27"
                    percentage="39%"
                  />

                  <Department
                    name="Marketing"
                    count="24"
                    percentage="34%"
                  />

                </div>

              </div>

            </section>


          </div>

        </main>

      </div>

    </div>
  );
}


/* ================================================
   NAV ITEM
================================================ */

function NavItem({ icon, text, active }) {
  return (
    <button className={`nav-item ${active ? "active" : ""}`}>
      <span className="nav-icon">
        <img
          src={icon}
          alt={text}
          style={{ width: 18, height: 18, objectFit: "contain" }}
        />
      </span>
      <span>{text}</span>
    </button>
  );
}


/* ================================================
   STAT CARD
================================================ */

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

      <div className={`stat-card-icon ${type}`}>
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

          <span>
            {change}
          </span>

          {description}

        </div>

      </div>

      <div className="stat-menu">
        •••
      </div>

    </div>
  );
}


/* ================================================
   QUICK ACTION
================================================ */

function QuickAction({
  icon,
  title,
  description,
  type,
}) {

  return (
    <button className="quick-action">

      <div className={`quick-action-icon ${type}`}>
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

      <span className="action-arrow">
        →
      </span>

    </button>
  );
}


/* ================================================
   EMPLOYEE ROW
================================================ */

function EmployeeRow({
  initials,
  name,
  role,
  department,
  status,
}) {

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
        className={`employee-status ${
          status === "Active"
            ? "status-active"
            : "status-leave"
        }`}
      >
        {status}
      </div>

    </div>
  );
}


/* ================================================
   DEPARTMENT
================================================ */

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
        ></div>

      </div>

    </div>
  );
}


export default App;