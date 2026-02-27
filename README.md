# College Placement Portal — NIT Warangal

A full-stack web application for managing campus placements at NIT Warangal. Built with **React + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 📁 Project Structure

```
loginpage/
├── public/                  # Static assets
├── src/                     # React frontend
│   ├── assets/              # Images (NITW logo, etc.)
│   ├── api/
│   │   └── axios.js         # Axios instance with base URL config
│   ├── components/
│   │   ├── ProtectedRoute.jsx       # Route guard for authenticated pages
│   │   └── auth/
│   │       ├── BasicInfoForm.jsx     # Student registration step 1
│   │       ├── AcademicsForm.jsx     # Student registration step 2
│   │       ├── CredentialsForm.jsx   # Student registration step 3
│   │       ├── OTPVerification.jsx   # OTP input component
│   │       ├── PasswordStrength.jsx  # Password strength meter
│   │       ├── RegistrationProgress.jsx # Step progress indicator
│   │       └── RegistrationSuccess.jsx  # Success message component
│   ├── context/
│   │   └── AuthContext.jsx   # React Context for auth state management
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx             # Sliding login/register page
│   │   │   ├── StudentRegister.jsx   # Multi-step student registration
│   │   │   ├── CompanyRegister.jsx   # Company registration form
│   │   │   └── ForgotPassword.jsx    # Password recovery flow
│   │   └── dashboard/
│   │       ├── StudentDashboard.jsx  # Student profile dashboard
│   │       └── CompanyDashboard.jsx  # Company profile dashboard
│   ├── App.jsx               # Main app with routes
│   ├── main.jsx              # App entry point
│   └── index.css             # All styles (design system + components)
├── server/                   # Express backend
│   ├── models/
│   │   ├── Student.js        # Mongoose schema for students
│   │   └── Company.js        # Mongoose schema for companies
│   ├── routes/
│   │   ├── auth.js           # Register & login endpoints
│   │   └── user.js           # Protected user profile endpoint
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── index.js              # Express server entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
├── index.html
├── vite.config.js            # Vite config with API proxy
├── package.json
└── README.md
```

---

## ✨ Features

### Authentication
- **Student Registration** — Multi-step form (Basic Info → Academics → Credentials) with NITW email validation
- **Company Registration** — Single-page form with admin approval notice
- **Login** — Sliding panel UI with JWT-based authentication
- **Forgot Password** — Email → OTP → Reset flow
- **Protected Routes** — Role-based access (student/company dashboards)

### UI/UX
- NITW official logo on every page
- Responsive design (mobile + desktop)
- Animated transitions and micro-interactions
- Password strength meter
- Form validation with real-time feedback

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, React Router 7, Vite 7   |
| Backend    | Node.js, Express 4                  |
| Database   | MongoDB (Mongoose 8)                |
| Auth       | JWT (jsonwebtoken), bcryptjs        |
| HTTP       | Axios                               |

---

## 🚀 How to Run

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** — running locally or a cloud instance (Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/fanofsrinivas/Placement-Website.git
cd Placement-Website
git checkout loginpage
```

### 2. Start MongoDB (local)

```bash
brew services start mongodb-community
```

Or if using MongoDB Atlas, update the connection string in `server/.env`.

### 3. Setup & Run the Backend

```bash
cd server
npm install

# Create .env file (copy from example)
cp .env.example .env
# Edit .env if needed (default uses local MongoDB)

npm run dev
```

The backend will start at **http://localhost:5000**.  
You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### 4. Setup & Run the Frontend

Open a **new terminal**:

```bash
# From the project root directory
npm install
npm run dev
```

The frontend will start at **http://localhost:5173**.

### 5. Open in Browser

Navigate to **http://localhost:5173** and you're ready to go!

---

## 🔑 API Endpoints

| Method | Endpoint              | Description              | Auth Required |
|--------|-----------------------|--------------------------|---------------|
| POST   | `/api/auth/register/student` | Register a student  | No            |
| POST   | `/api/auth/register/company` | Register a company  | No            |
| POST   | `/api/auth/login`     | Login (returns JWT)       | No            |
| GET    | `/api/user/me`        | Get logged-in user info   | Yes (JWT)     |

---

## 📝 Environment Variables

Create `server/.env` (see `server/.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/placement-portal
JWT_SECRET=your-secret-key-here
```

---

## 👥 Contributors

- NIT Warangal — College Placement Portal Team
