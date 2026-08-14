import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import "./LoginPage.css";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
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
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
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
                    data.message || "Login failed"
                );
            }

            login(data);

            navigate("/dashboard");

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <span className="auth-label">
                        EMPLOYEE MANAGEMENT SYSTEM
                    </span>

                    <h1>Welcome back</h1>

                    <p>
                        Sign in to continue to your dashboard.
                    </p>

                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="auth-field">

                        <label>Email</label>

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

                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>

                </form>

                <p className="auth-footer">

                    Don't have an account?{" "}

                    <Link to="/register">
                        Create account
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default LoginPage;