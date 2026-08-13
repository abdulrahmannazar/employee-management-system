const pool = require("../config/database.js");


// CREATE EMPLOYEE
// POST /api/employees


const createEmployee = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            company_id,
            department_id,
            manager_id,
            joining_date,
            status
        } = req.body;



        // Basic validation
      
        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                message: "First name, last name and email are required"
            });
        }

        if (!company_id || !department_id) {
            return res.status(400).json({
                message: "Company and department are required"
            });
        }

        if (!joining_date) {
            return res.status(400).json({
                message: "Joining date is required"
            });
        }

        
        // validating joining date not being a future date as the date created
        

        const today = new Date();
        const todayString = today.toISOString().split("T")[0];

        if (joining_date > todayString) {
            return res.status(400).json({
                message: "Joining date cannot be in the future"
            });
        }

        
        // Checking company is active or not
        

        const company = await pool.query(
            `SELECT company_id
             FROM companies
             WHERE company_id = $1
             AND status = 'ACTIVE'`,
            [company_id]
        );

        if (company.rows.length === 0) {
            return res.status(404).json({
                message: "Active company not found"
            });
        }

        
        // checking if the company have the department
        // to the selected company
        

        const department = await pool.query(
            `SELECT department_id
             FROM departments
             WHERE department_id = $1
             AND company_id = $2
             AND status = 'ACTIVE'`,
            [department_id, company_id]
        );

        if (department.rows.length === 0) {
            return res.status(400).json({
                message: "Department does not belong to the selected company"
            });
        }

        
        // Checking  if manager is provided
        

        if (manager_id) {
            const manager = await pool.query(
                `SELECT employee_id
                 FROM employees
                 WHERE employee_id = $1
                 AND company_id = $2
                 AND status = 'ACTIVE'`,
                [manager_id, company_id]
            );

            if (manager.rows.length === 0) {
                return res.status(400).json({
                    message: "Manager must be an active employee in the same company"
                });
            }
        }

        
        // adding new employee
        

        const result = await pool.query(
            `INSERT INTO employees
                (
                    first_name,
                    last_name,
                    email,
                    phone,
                    company_id,
                    department_id,
                    manager_id,
                    joining_date,
                    status
                )
             VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [
                first_name.trim(),
                last_name.trim(),
                email.trim(),
                phone || null,
                company_id,
                department_id,
                manager_id || null,
                joining_date,
                status || "ACTIVE"
            ]
        );

        res.status(201).json({
            message: "Employee created successfully",
            employee: result.rows[0]
        });

    } catch (error) {
        console.error("Create employee error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "An employee with this email already exists"
            });
        }

        res.status(500).json({
            message: "Failed to create employee"
        });
    }
};



// GET ALL EMPLOYEES
// GET /api/employees


const getEmployees = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                e.employee_id,
                e.first_name,
                e.last_name,
                e.email,
                e.phone,
                e.joining_date,
                e.status,

                c.company_id,
                c.name AS company_name,

                d.department_id,
                d.name AS department_name,

                m.employee_id AS manager_id,
                CONCAT(m.first_name, ' ', m.last_name) AS manager_name

             FROM employees e

             JOIN companies c
                ON e.company_id = c.company_id

             JOIN departments d
                ON e.department_id = d.department_id

             LEFT JOIN employees m
                ON e.manager_id = m.employee_id

             ORDER BY e.employee_id`
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get employees error:", error);

        res.status(500).json({
            message: "Failed to fetch employees"
        });
    }
};



// GET ONE EMPLOYEE
// GET /api/employees/:id


const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                e.employee_id,
                e.first_name,
                e.last_name,
                e.email,
                e.phone,
                e.joining_date,
                e.status,

                c.company_id,
                c.name AS company_name,

                d.department_id,
                d.name AS department_name,

                m.employee_id AS manager_id,
                CONCAT(m.first_name, ' ', m.last_name) AS manager_name

             FROM employees e

             JOIN companies c
                ON e.company_id = c.company_id

             JOIN departments d
                ON e.department_id = d.department_id

             LEFT JOIN employees m
                ON e.manager_id = m.employee_id

             WHERE e.employee_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Get employee error:", error);

        res.status(500).json({
            message: "Failed to fetch employee"
        });
    }
};



// UPDATE EMPLOYEE
// PUT /api/employees/:id


const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            first_name,
            last_name,
            email,
            phone,
            company_id,
            department_id,
            manager_id,
            joining_date,
            status
        } = req.body;

        if (!first_name || !last_name || !email) {
            return res.status(400).json({
                message: "First name, last name and email are required"
            });
        }

        if (!company_id || !department_id) {
            return res.status(400).json({
                message: "Company and department are required"
            });
        }

        // Joining date validation

        const today = new Date();
        const todayString = today.toISOString().split("T")[0];

        if (joining_date > todayString) {
            return res.status(400).json({
                message: "Joining date cannot be in the future"
            });
        }

        // Check company

        const company = await pool.query(
            `SELECT company_id
             FROM companies
             WHERE company_id = $1
             AND status = 'ACTIVE'`,
            [company_id]
        );

        if (company.rows.length === 0) {
            return res.status(404).json({
                message: "Active company not found"
            });
        }

        // Check department belongs to company

        const department = await pool.query(
            `SELECT department_id
             FROM departments
             WHERE department_id = $1
             AND company_id = $2
             AND status = 'ACTIVE'`,
            [department_id, company_id]
        );

        if (department.rows.length === 0) {
            return res.status(400).json({
                message: "Department does not belong to the selected company"
            });
        }

        // Check manager

        if (manager_id) {
            const manager = await pool.query(
                `SELECT employee_id
                 FROM employees
                 WHERE employee_id = $1
                 AND company_id = $2
                 AND employee_id != $3
                 AND status = 'ACTIVE'`,
                [manager_id, company_id, id]
            );

            if (manager.rows.length === 0) {
                return res.status(400).json({
                    message: "Manager must be an active employee in the same company"
                });
            }
        }

        // Update

        const result = await pool.query(
            `UPDATE employees
             SET
                first_name = $1,
                last_name = $2,
                email = $3,
                phone = $4,
                company_id = $5,
                department_id = $6,
                manager_id = $7,
                joining_date = $8,
                status = $9
             WHERE employee_id = $10
             RETURNING *`,
            [
                first_name.trim(),
                last_name.trim(),
                email.trim(),
                phone || null,
                company_id,
                department_id,
                manager_id || null,
                joining_date,
                status || "ACTIVE",
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee updated successfully",
            employee: result.rows[0]
        });

    } catch (error) {
        console.error("Update employee error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "An employee with this email already exists"
            });
        }

        res.status(500).json({
            message: "Failed to update employee"
        });
    }
};



// REMOVE EMPLOYEE
// DELETE /api/employees/:id


const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE employees
             SET status = 'TERMINATED'
             WHERE employee_id = $1
             RETURNING employee_id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee terminated successfully"
        });

    } catch (error) {
        console.error("Delete employee error:", error);

        res.status(500).json({
            message: "Failed to terminate employee"
        });
    }
};


module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};