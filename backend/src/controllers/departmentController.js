const pool = require("../config/database.js");


// CREATING DEPARTMENT
// POST /api/departments


const createDepartment = async (req, res) => {
    try {
        const { company_id, name } = req.body;

        if (!company_id) {
            return res.status(400).json({
                message: "Company ID is required"
            });
        }

        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Department name is required"
            });
        }

        // Check that company exists and is active
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

        const result = await pool.query(
            `INSERT INTO departments
                (company_id, name)
             VALUES ($1, $2)
             RETURNING *`,
            [
                company_id,
                name.trim()
            ]
        );

        res.status(201).json({
            message: "Department created successfully",
            department: result.rows[0]
        });

    } catch (error) {
        console.error("Create department error:", error);

        // to avoid duplicate department in same company
        if (error.code === "23505") {
            return res.status(409).json({
                message: "This department already exists in this company"
            });
        }

        res.status(500).json({
            message: "Failed to create department"
        });
    }
};



// GET ALL DEPARTMENTS
// GET /api/departments


const getDepartments = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                d.department_id,
                d.name AS department_name,
                d.status,
                c.company_id,
                c.name AS company_name
             FROM departments d
             JOIN companies c
                ON d.company_id = c.company_id
             ORDER BY c.name, d.name`
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get departments error:", error);

        res.status(500).json({
            message: "Failed to fetch departments"
        });
    }
};



// GET DEPARTMENTS BY COMPANY
// GET /api/departments/company/:companyId


const getDepartmentsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;

        const company = await pool.query(
            `SELECT company_id, name
             FROM companies
             WHERE company_id = $1`,
            [companyId]
        );

        if (company.rows.length === 0) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        const result = await pool.query(
            `SELECT
                department_id,
                name,
                status
             FROM departments
             WHERE company_id = $1
             ORDER BY name`,
            [companyId]
        );

        res.status(200).json({
            company: company.rows[0],
            departments: result.rows
        });

    } catch (error) {
        console.error("Get company departments error:", error);

        res.status(500).json({
            message: "Failed to fetch company departments"
        });
    }
};



// GET ONE DEPARTMENT
// GET /api/departments/:id


const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                d.department_id,
                d.name AS department_name,
                d.status,
                c.company_id,
                c.name AS company_name
             FROM departments d
             JOIN companies c
                ON d.company_id = c.company_id
             WHERE d.department_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Get department error:", error);

        res.status(500).json({
            message: "Failed to fetch department"
        });
    }
};



// UPDATE DEPARTMENT
// PUT /api/departments/:id


const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Department name is required"
            });
        }

        const result = await pool.query(
            `UPDATE departments
             SET
                name = $1,
                status = $2
             WHERE department_id = $3
             RETURNING *`,
            [
                name.trim(),
                status || "ACTIVE",
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        res.status(200).json({
            message: "Department updated successfully",
            department: result.rows[0]
        });

    } catch (error) {
        console.error("Update department error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "This department already exists in this company"
            });
        }

        res.status(500).json({
            message: "Failed to update department"
        });
    }
};



// DEACTIVATE DEPARTMENT
// DELETE /api/departments/:id


const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const department = await pool.query(
            `SELECT department_id
             FROM departments
             WHERE department_id = $1`,
            [id]
        );

        if (department.rows.length === 0) {
            return res.status(404).json({
                message: "Department not found"
            });
        }

        // Don't deactivate a department that still has employees
        const employees = await pool.query(
            `SELECT COUNT(*)::INTEGER AS count
             FROM employees
             WHERE department_id = $1
             AND status != 'TERMINATED'`,
            [id]
        );

        if (employees.rows[0].count > 0) {
            return res.status(400).json({
                message: "Cannot deactivate a department that has employees"
            });
        }

        await pool.query(
            `UPDATE departments
             SET status = 'INACTIVE'
             WHERE department_id = $1`,
            [id]
        );

        res.status(200).json({
            message: "Department deactivated successfully"
        });

    } catch (error) {
        console.error("Delete department error:", error);

        res.status(500).json({
            message: "Failed to deactivate department"
        });
    }
};


module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentsByCompany,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
};