const express = require("express");

const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticateToken,
    getEmployees
);

router.get(
    "/:id",
    authenticateToken,
    getEmployeeById
);

router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN", "HR"),
    createEmployee
);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN", "HR"),
    updateEmployee
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN"),
    deleteEmployee
);

module.exports = router;