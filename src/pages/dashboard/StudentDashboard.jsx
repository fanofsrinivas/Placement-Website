import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import nitwLogo from '../../assets/nitw-logo.png';

export default function StudentDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    const infoItems = [
        { icon: '🎓', label: 'Roll Number', value: user.rollNumber },
        { icon: '📧', label: 'Email', value: user.email },
        { icon: '📱', label: 'Mobile', value: user.mobile },
        { icon: '📅', label: 'Date of Birth', value: user.dob },
        { icon: '🎯', label: 'Degree', value: user.degree },
        { icon: '🔬', label: 'Branch', value: user.branch },
    ];

    return (
        <div className="auth-page">
            <div className="dashboard">
                <div className="dashboard__header">
                    <img src={nitwLogo} alt="NIT Warangal" className="dashboard__logo" />
                    <div className="dashboard__avatar">
                        {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <h1 className="dashboard__name">{user.name}</h1>
                    <span className="dashboard__badge dashboard__badge--student">Student</span>
                </div>

                <div className="dashboard__grid">
                    {infoItems.map((item) => (
                        <div className="dashboard__card" key={item.label}>
                            <span className="dashboard__card-icon">{item.icon}</span>
                            <span className="dashboard__card-label">{item.label}</span>
                            <span className="dashboard__card-value">{item.value || '—'}</span>
                        </div>
                    ))}
                </div>

                <button className="btn btn-secondary dashboard__logout" onClick={handleLogout}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Logout
                </button>
            </div>
        </div>
    );
}
