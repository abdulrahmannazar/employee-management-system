const express = require("express");

const {
    createDepartment,
    getDepartments,
    getDepartmentsByCompany,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} = require("../controllers/departmentController");

const router = express.Router();

router.post("/", createDepartment);

router.get("/", getDepartments);

router.get("/company/:companyId", getDepartmentsByCompany);

router.get("/:id", getDepartmentById);

router.put("/:id", updateDepartment);

router.delete("/:id", deleteDepartment);

module.exports = router;