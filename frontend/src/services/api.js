const API_BASE_URL = "http://localhost:5000/api";


// TOKEN HELPERS


export const getToken = () => {
    return localStorage.getItem("token");
};

export const setToken = (token) => {
    localStorage.setItem("token", token);
};

export const removeToken = () => {
    localStorage.removeItem("token");
};



// GENERIC REQUEST


const request = async (endpoint, options = {}) => {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong"
        );
    }

    return data;
};


// AUTHORIZATION


export const login = async (email, password) => {
    const data = await request(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    if (data.token) {
        setToken(data.token);
    }

    if (data.user) {
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );
    }

    return data;
};

export const logout = () => {
    removeToken();
    localStorage.removeItem("user");
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;
};



// DASHBOARD


export const getDashboard = () => {
    return request("/dashboard");
};



// COMPANIES


export const getCompanies = () => {
    return request("/companies");
};

export const getCompanyById = (id) => {
    return request(`/companies/${id}`);
};

export const createCompany = (company) => {
    return request(
        "/companies",
        {
            method: "POST",
            body: JSON.stringify(company)
        }
    );
};

export const updateCompany = (id, company) => {
    return request(
        `/companies/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(company)
        }
    );
};

export const deleteCompany = (id) => {
    return request(
        `/companies/${id}`,
        {
            method: "DELETE"
        }
    );
};



// DEPARTMENTS


export const getDepartments = () => {
    return request("/departments");
};

export const getDepartmentsByCompany = (companyId) => {
    return request(
        `/departments/company/${companyId}`
    );
};

export const getDepartmentById = (id) => {
    return request(`/departments/${id}`);
};

export const createDepartment = (department) => {
    return request(
        "/departments",
        {
            method: "POST",
            body: JSON.stringify(department)
        }
    );
};

export const updateDepartment = (id, department) => {
    return request(
        `/departments/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(department)
        }
    );
};

export const deleteDepartment = (id) => {
    return request(
        `/departments/${id}`,
        {
            method: "DELETE"
        }
    );
};



// EMPLOYEES


export const getEmployees = (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(
        ([key, value]) => {
            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {
                query.append(key, value);
            }
        }
    );

    const queryString = query.toString();

    return request(
        `/employees${queryString ? `?${queryString}` : ""}`
    );
};

export const getEmployeeById = (id) => {
    return request(`/employees/${id}`);
};

export const createEmployee = (employee) => {
    return request(
        "/employees",
        {
            method: "POST",
            body: JSON.stringify(employee)
        }
    );
};

export const updateEmployee = (id, employee) => {
    return request(
        `/employees/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(employee)
        }
    );
};

export const deleteEmployee = (id) => {
    return request(
        `/employees/${id}`,
        {
            method: "DELETE"
        }
    );
};