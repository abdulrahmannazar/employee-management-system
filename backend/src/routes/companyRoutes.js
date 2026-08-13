
const express = require("express");

const {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany
} = require("../controllers/companyController");

const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
    "/",
    authenticateToken,
    getCompanies
);

router.get(
    "/:id",
    authenticateToken,
    getCompanyById
);

router.post(
    "/",
    authenticateToken,
    authorizeRoles("ADMIN"),
    createCompany
);

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN"),
    updateCompany
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("ADMIN"),
    deleteCompany
);

module.exports = router;