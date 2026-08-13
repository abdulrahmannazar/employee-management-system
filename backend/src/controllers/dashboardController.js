const pool = require("../config/database.js");


// GET DASHBOARD DATA
// GET /api/dashboard


const getDashboard = async (req, res) => {
    try {
       
        // Company statistics
       

        const companyStats = await pool.query(`
            SELECT
                COUNT(*)::INTEGER AS total_companies,
                COUNT(*) FILTER (
                    WHERE status = 'ACTIVE'
                )::INTEGER AS active_companies,
                COUNT(*) FILTER (
                    WHERE status = 'INACTIVE'
                )::INTEGER AS inactive_companies
            FROM companies
        `);

        
        // Department statistics
     

        const departmentStats = await pool.query(`
            SELECT
                COUNT(*)::INTEGER AS total_departments,
                COUNT(*) FILTER (
                    WHERE status = 'ACTIVE'
                )::INTEGER AS active_departments,
                COUNT(*) FILTER (
                    WHERE status = 'INACTIVE'
                )::INTEGER AS inactive_departments
            FROM departments
        `);

        
        // Employee statistics
        

        const employeeStats = await pool.query(`
            SELECT
                COUNT(*)::INTEGER AS total_employees,

                COUNT(*) FILTER (
                    WHERE status = 'ACTIVE'
                )::INTEGER AS active_employees,

                COUNT(*) FILTER (
                    WHERE status = 'TERMINATED'
                )::INTEGER AS terminated_employees
            FROM employees
        `);

        
        // Recently joined employees
       

        const recentEmployees = await pool.query(`
            SELECT
                e.employee_id,
                e.first_name,
                e.last_name,
                e.email,
                e.joining_date,
                e.status,

                c.company_id,
                c.name AS company_name,

                d.department_id,
                d.name AS department_name

            FROM employees e

            JOIN companies c
                ON e.company_id = c.company_id

            JOIN departments d
                ON e.department_id = d.department_id

            ORDER BY e.joining_date DESC

            LIMIT 5
        `);

        
        // Final response
        
        res.status(200).json({
            companies: companyStats.rows[0],

            departments: departmentStats.rows[0],

            employees: employeeStats.rows[0],

            recent_employees: recentEmployees.rows
        });

    } catch (error) {
        console.error(
            "Dashboard error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch dashboard data"
        });
    }
};


module.exports = {
    getDashboard
};