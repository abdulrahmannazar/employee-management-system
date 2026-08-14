import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });

    const login = (loginData) => {
        localStorage.setItem(
            "token",
            loginData.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(loginData.user)
        );

        setToken(loginData.token);
        setUser(loginData.user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token && !!user;

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}