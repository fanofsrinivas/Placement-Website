import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import StudentRegister from './pages/auth/StudentRegister'
import CompanyRegister from './pages/auth/CompanyRegister'
import ForgotPassword from './pages/auth/ForgotPassword'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/student-register" element={<StudentRegister />} />
      <Route path="/company-register" element={<CompanyRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
