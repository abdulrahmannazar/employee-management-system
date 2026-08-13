const pool = require("../config/database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER
// POST /api/auth/register


const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role
        } = req.body;

        
        // Validation
       

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        
        // Check if user is existing 
        

        const existingUser = await pool.query(
            `SELECT user_id
             FROM users
             WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

      
        // Validate role
       

        const allowedRoles = [
            "ADMIN",
            "HR",
            "EMPLOYEE"
        ];

        const selectedRole = role || "EMPLOYEE";

        if (!allowedRoles.includes(selectedRole)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        
        // Hash password
      

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

      
        // Create user
      

        const result = await pool.query(
            `INSERT INTO users
                (
                    name,
                    email,
                    password,
                    role
                )
             VALUES
                ($1, $2, $3, $4)
             RETURNING
                user_id,
                name,
                email,
                role,
                status,
                created_at`,
            [
                name.trim(),
                email.trim(),
                hashedPassword,
                selectedRole
            ]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(
            "Register error:",
            error
        );

        res.status(500).json({
            message: "Failed to register user"
        });
    }
};


// LOGIN
// POST /api/auth/login


const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        
        // Validation
      

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

     
        // Find user
      

        const result = await pool.query(
            `SELECT *
             FROM users
             WHERE LOWER(email) = LOWER($1)`,
            [email.trim()]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        
        // Check status
    

        if (user.status !== "ACTIVE") {
            return res.status(403).json({
                message: "User account is inactive"
            });
        }

  
        // Compare password
       

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT
       

        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN || "1d"
            }
        );

      
        // Response
       

        res.status(200).json({
            message: "Login successful",

            token,

            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Failed to login"
        });
    }
};


module.exports = {
    register,
    login
};