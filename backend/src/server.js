require("dotenv").config();

const app = require("./app");
const pool = require("./config/database.js");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await pool.query("SELECT NOW()");

        console.log("Database connection successful");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on http://0.0.0.0:${PORT}`);
        });
    } catch (error) {
        console.error("Unable to connect to database:", error);
        process.exit(1);
    }
};

startServer();