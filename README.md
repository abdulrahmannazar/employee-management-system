# Employee Management System

A full-stack Employee Management System for managing employees, companies, departments, authentication, and role-based access.

## Tech Stack

### Frontend

* React
* Vite
* JavaScript / JSX
* React Router
* CSS

### Backend

* Node.js
* Express.js
* PostgreSQL
* JWT Authentication
* bcrypt
* CORS

### Database

* PostgreSQL
* Supabase

### Deployment

* Vercel — Frontend
* Render — Backend
* Supabase — Database

---

## Features

* User registration and login
* JWT authentication
* Role-based access control
* Employee management
* Company management
* Department management
* Employee search and filtering
* Employee status management
* Company employee counts
* Responsive dashboard
* Mobile-friendly interface

---

## Project Structure

```text
employee-management-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## How to Load the Project

### 1. Clone the repository

```bash
git clone <repository-url>
cd employee-management-system
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

For the frontend, configure the API URL to point to the backend:

```env
VITE_API_URL=http://localhost:5000/api
```

For the deployed application, use the Render backend URL instead.

### 5. Start the backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 6. Start the frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## Database

The application uses PostgreSQL.

For production, the database is hosted on Supabase.

The backend connects to the database using the `DATABASE_URL` environment variable.

---

## Production

The application is deployed using:

```text
Frontend  → Vercel
Backend   → Render
Database  → Supabase
```

The deployed frontend communicates with the Render backend through the production API URL.

---



## to visit the website

https://employee-management-system-beryl-mu.vercel.app/
