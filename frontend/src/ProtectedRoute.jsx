import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

function ProtectedRoute({ children, allowedRoles }) {
    const {
        isAuthenticated,
        user
    } = useAuth();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return children;
}

export default ProtectedRoute;