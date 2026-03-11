import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';
import ProtectedRoute from './components/shared/ProtectedRoute';
import ErrorBoundary from './components/shared/ErrorBoundary';
import LoadingSkeleton from './components/shared/LoadingSkeleton';
import NotFound from './components/shared/NotFound';
import './index.css';

// Public Pages
import Home from './pages/public/Home';
import AboutTPO from './pages/public/AboutTPO';
import Recruiters from './pages/public/Recruiters';
import PlacementStats from './pages/public/PlacementStats';
import ContactUs from './pages/public/ContactUs';

// Auth Pages
import Login from './pages/auth/Login';
import StudentRegister from './pages/auth/StudentRegister';
import CompanyRegister from './pages/auth/CompanyRegister';
import ForgotPassword from './pages/auth/ForgotPassword';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import ApplyJob from './pages/student/ApplyJob';
import MyApplications from './pages/student/MyApplications';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';
import JobManagement from './pages/company/JobManagement';
import CandidatePipeline from './pages/company/CandidatePipeline';
import InterviewScheduler from './pages/company/InterviewScheduler';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserVerification from './pages/admin/UserVerification';
import JobApproval from './pages/admin/JobApproval';

// TPO Pages
import TPODashboard from './pages/tpo/Dashboard';
import DriveManagement from './pages/tpo/DriveManagement';
import LegacyDataImport from './pages/tpo/LegacyDataImport';
import PlacementAnalytics from './pages/tpo/PlacementAnalytics';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
          <Navbar />

          <Suspense fallback={<LoadingSkeleton />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutTPO />} />
              <Route path="/recruiters" element={<Recruiters />} />
              <Route path="/stats" element={<PlacementStats />} />
              <Route path="/contact" element={<ContactUs />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register/student" element={<StudentRegister />} />
              <Route path="/register/company" element={<CompanyRegister />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Student Routes */}
              <Route path="/student" element={
                <ProtectedRoute roles={['student']}>
                  <Sidebar role="student" />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="apply" element={<ApplyJob />} />
                <Route path="applications" element={<MyApplications />} />
              </Route>

              {/* Company Routes */}
              <Route path="/company" element={
                <ProtectedRoute roles={['company']}>
                  <Sidebar role="company" />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<CompanyDashboard />} />
                <Route path="jobs" element={<JobManagement />} />
                <Route path="pipeline" element={<CandidatePipeline />} />
                <Route path="interviews" element={<InterviewScheduler />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <Sidebar role="admin" />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="verify" element={<UserVerification />} />
                <Route path="job-approvals" element={<JobApproval />} />
              </Route>

              {/* TPO Routes */}
              <Route path="/tpo" element={
                <ProtectedRoute roles={['tpo']}>
                  <Sidebar role="tpo" />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<TPODashboard />} />
                <Route path="drives" element={<DriveManagement />} />
                <Route path="legacy-import" element={<LegacyDataImport />} />
                <Route path="analytics" element={<PlacementAnalytics />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
