import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import "./RegisterPage.css";

function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "EMPLOYEE"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch(
                "https://employee-management-system-cb7g.onrender.com/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Registration failed"
                );
            }

            setSuccess(
                "Account created successfully. Signing you in..."
            );

            

            const loginResponse = await fetch(
                "https://employee-management-system-cb7g.onrender.com/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: form.email,
                        password: form.password
                    })
                }
            );

            const loginData = await loginResponse.json();

            if (!loginResponse.ok) {
                throw new Error(
                    "Account created, but automatic login failed."
                );
            }

            login(loginData);

            navigate("/dashboard");

        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card register-card">

                <div className="auth-header">

                    <span className="auth-label">
                        EMPLOYEE MANAGEMENT SYSTEM
                    </span>

                    <h1>
                        Create account
                    </h1>

                    <p>
                        Register a new account to access the system.
                    </p>

                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="auth-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="auth-field">

                        <label>
                            Full name
                        </label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="auth-field">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="auth-field">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />

                    </div>

                    <div className="auth-field">

                        <label>
                            Role
                        </label>

                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="EMPLOYEE">
                                Employee
                            </option>

                            <option value="HR">
                                HR
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>
                        </select>

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create account"}
                    </button>

                </form>

                <p className="auth-footer">

                    Already have an account?{" "}

                    <Link to="/login">
                        Sign in
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default RegisterPage;