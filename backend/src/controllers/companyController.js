const pool = require("../config/database.js");


// CREATING COMPANY
// POST /api/companies


const createCompany = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Company name is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO companies
                (name, email, phone, address)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [
                name.trim(),
                email || null,
                phone || null,
                address || null
            ]
        );

        res.status(201).json({
            message: "Company created successfully",
            company: result.rows[0]
        });

    } catch (error) {
        console.error("Create company error:", error);

        res.status(500).json({
            message: "Failed to create company"
        });
    }
};



// GET ALL COMPANIES
// GET /api/companies


const getCompanies = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                c.company_id,
                c.name,
                c.email,
                c.phone,
                c.address,
                c.status,
                COUNT(e.employee_id)::INTEGER AS employee_count
             FROM companies c
             LEFT JOIN employees e
                ON c.company_id = e.company_id
             GROUP BY c.company_id
             ORDER BY c.company_id`
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("Get companies error:", error);

        res.status(500).json({
            message: "Failed to fetch companies"
        });
    }
};



// GET ONE COMPANY
// GET /api/companies/:id


const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                c.company_id,
                c.name,
                c.email,
                c.phone,
                c.address,
                c.status,
                COUNT(e.employee_id)::INTEGER AS employee_count
             FROM companies c
             LEFT JOIN employees e
                ON c.company_id = e.company_id
             WHERE c.company_id = $1
             GROUP BY c.company_id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Get company error:", error);

        res.status(500).json({
            message: "Failed to fetch company"
        });
    }
};



// UPDATE COMPANY
// PUT /api/companies/:id


const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, status } = req.body;

        if (!name || name.trim() === "") {
            return res.status(400).json({
                message: "Company name is required"
            });
        }

        const result = await pool.query(
            `UPDATE companies
             SET
                name = $1,
                email = $2,
                phone = $3,
                address = $4,
                status = $5
             WHERE company_id = $6
             RETURNING *`,
            [
                name.trim(),
                email || null,
                phone || null,
                address || null,
                status || "ACTIVE",
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.status(200).json({
            message: "Company updated successfully",
            company: result.rows[0]
        });

    } catch (error) {
        console.error("Update company error:", error);

        res.status(500).json({
            message: "Failed to update company"
        });
    }
};



// DELETE / DEACTIVATE COMPANY
// DELETE /api/companies/:id


const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;

        // Check whether company exists
        const company = await pool.query(
            `SELECT company_id
             FROM companies
             WHERE company_id = $1`,
            [id]
        );

        if (company.rows.length === 0) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        // Check whether company has employees
        const employees = await pool.query(
            `SELECT COUNT(*)::INTEGER AS count
             FROM employees
             WHERE company_id = $1`,
            [id]
        );

        if (employees.rows[0].count > 0) {
            return res.status(400).json({
                message: "Cannot delete a company that has employees"
            });
        }

        await pool.query(
            `UPDATE companies
             SET status = 'INACTIVE'
             WHERE company_id = $1`,
            [id]
        );

        res.status(200).json({
            message: "Company deactivated successfully"
        });

    } catch (error) {
        console.error("Delete company error:", error);

        res.status(500).json({
            message: "Failed to deactivate company"
        });
    }
};


module.exports = {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
};