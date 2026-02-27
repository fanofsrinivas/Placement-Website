import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import StudentRegister from './pages/auth/StudentRegister'
import CompanyRegister from './pages/auth/CompanyRegister'
import ForgotPassword from './pages/auth/ForgotPassword'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import CompanyDashboard from './pages/dashboard/CompanyDashboard'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/company-register" element={<CompanyRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute role="company">
              <CompanyDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
