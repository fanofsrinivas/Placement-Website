import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="auth-page">
                <div style={{ color: '#fff', fontSize: '1.1rem' }}>Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // If a specific role is required, check it
    if (role && user?.role !== role) {
        const redirect = user?.role === 'student' ? '/student-dashboard' : '/company-dashboard';
        return <Navigate to={redirect} replace />;
    }

    return children;
}
