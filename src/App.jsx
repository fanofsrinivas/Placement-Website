import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/public/Home/Home.jsx'
import AboutTPO from './pages/public/AboutTPO/AboutTPO.jsx'
import CompanyRegister from './pages/auth/CompanyRegister/CompanyRegister.jsx'
import StudentDashboard from './pages/student/Dashboard/Dashboard.jsx'
import StudentProfile from './pages/student/Profile/Profile.jsx'
import ApplyJob from './pages/student/ApplyJob/ApplyJob.jsx'
import CompanyDashboard from './pages/company/Dashboard/Dashboard.jsx'
import AdminDashboard from './pages/admin/Dashboard/Dashboard.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-tpo" element={<AboutTPO />} />
        <Route path="/register/company" element={<CompanyRegister />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/apply-job" element={<ApplyJob />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
