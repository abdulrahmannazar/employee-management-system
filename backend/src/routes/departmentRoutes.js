const express = require("express");

const {
    createDepartment,
    getDepartments,
    getDepartmentsByCompany,
    getDepartmentById,
    updateDepartment,
    deleteDepartment
} = require("../controllers/departmentController");


const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


router.get(
    "/",
    authenticateToken,
    getDepartments
);
router.get(
    "/company/:companyId",
    authenticateToken,
    getDepartmentsByCompany
);

router.get(
    "/:id",
    authenticateToken,
    getDepartmentById
);

router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN", "HR"),
    createDepartment
);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN", "HR"),
    updateDepartment
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN"),
    deleteDepartment
);

module.exports = router;