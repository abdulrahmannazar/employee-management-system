const express = require("express");
const cors = require("cors");

const companyRoutes = require("./routes/companyRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Employee Management API is running"
    });
});

// Company routes
app.use("/api/companies", companyRoutes);

module.exports = app;