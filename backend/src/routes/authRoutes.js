const express = require("express");

const {
    register,
    login
} = require("../auth/authorization");

const router = express.Router();

// These routes must be public
router.post("/register", register);

router.post("/login", login);

module.exports = router;