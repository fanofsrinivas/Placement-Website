import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import nitwLogo from '../../assets/nitw-logo.png';

export default function CompanyDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    const companyInfo = [
        { icon: '🌐', label: 'Website', value: user.website },
        { icon: '💼', label: 'LinkedIn', value: user.linkedin },
        { icon: '📧', label: 'Login Email', value: user.email },
    ];

    const contactInfo = [
        { icon: '👤', label: 'HR Contact', value: user.hrName },
        { icon: '📧', label: 'HR Email', value: user.hrEmail },
        { icon: '📱', label: 'HR Phone', value: user.hrPhone },
    ];

    const address = [user.street, user.city, user.state, user.country].filter(Boolean).join(', ');

    return (
        <div className="auth-page">
            <div className="dashboard">
                <div className="dashboard__header">
                    <img src={nitwLogo} alt="NIT Warangal" className="dashboard__logo" />
                    <div className="dashboard__avatar dashboard__avatar--company">
                        {user.companyName?.charAt(0)?.toUpperCase()}
                    </div>
                    <h1 className="dashboard__name">{user.companyName}</h1>
                    <span className="dashboard__badge dashboard__badge--company">Company</span>
                </div>

                <div className="dashboard__section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /></svg>
                    Company Information
                </div>
                <div className="dashboard__grid">
                    {companyInfo.map((item) => (
                        <div className="dashboard__card" key={item.label}>
                            <span className="dashboard__card-icon">{item.icon}</span>
                            <span className="dashboard__card-label">{item.label}</span>
                            <span className="dashboard__card-value">{item.value || '—'}</span>
                        </div>
                    ))}
                </div>

                <div className="dashboard__section-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                    HR Contact
                </div>
                <div className="dashboard__grid">
                    {contactInfo.map((item) => (
                        <div className="dashboard__card" key={item.label}>
                            <span className="dashboard__card-icon">{item.icon}</span>
                            <span className="dashboard__card-label">{item.label}</span>
                            <span className="dashboard__card-value">{item.value || '—'}</span>
                        </div>
                    ))}
                </div>

                {address && (
                    <>
                        <div className="dashboard__section-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                            Address
                        </div>
                        <div className="dashboard__card dashboard__card--full">
                            <span className="dashboard__card-icon">📍</span>
                            <span className="dashboard__card-value">{address}</span>
                        </div>
                    </>
                )}

                <button className="btn btn-secondary dashboard__logout" onClick={handleLogout}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Logout
                </button>
            </div>
        </div>
    );
}
