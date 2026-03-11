import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from '../Dashboard.module.css';

const ProfileCircle = ({ pct }) => {
    const r = 26, c = 2 * Math.PI * r;
    return (
        <div className={styles.profileProgress}>
            <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r={r} fill="none" stroke="#e8eaf6" strokeWidth="6" />
                <circle cx="32" cy="32" r={r} fill="none" stroke="#1a237e" strokeWidth="6"
                    strokeDasharray={c} strokeDashoffset={c - (c * pct / 100)} strokeLinecap="round" />
            </svg>
            <span className={styles.profilePercent}>{pct}%</span>
        </div>
    );
};

const StudentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/student/dashboard')
            .then(res => setData(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSkeleton type="cards" />;

    const { user, stats, recentApplications } = data || {};
    const pct = user?.studentProfile?.profileCompleted || 0;

    return (
        <div>
            <div className="page-header">
                <h1>Welcome, {user?.studentProfile?.firstName || 'Student'}!</h1>
                <p>Here's your placement overview</p>
            </div>

            <div className={styles.profileBar}>
                <ProfileCircle pct={pct} />
                <div className={styles.profileInfo}>
                    <h3>Profile {pct === 100 ? 'Complete ✅' : `${pct}% Complete`}</h3>
                    <p>{pct < 100 ? 'Complete your profile to apply for jobs' : 'You are all set to apply!'}</p>
                </div>
                {pct < 100 && <Link to="/student/profile" className="btn btn-primary btn-sm">Complete Profile</Link>}
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8eaf6', color: '#1a237e' }}>📝</div>
                    <div className="stat-info"><h3>{stats?.totalApplications || 0}</h3><p>Total Applications</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fff3e0', color: '#e65100' }}>⏳</div>
                    <div className="stat-info"><h3>{stats?.pendingApplications || 0}</h3><p>Pending</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>🎤</div>
                    <div className="stat-info"><h3>{stats?.interviewsScheduled || 0}</h3><p>Interviews</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>🎉</div>
                    <div className="stat-info"><h3>{stats?.selected || 0}</h3><p>Selected</p></div>
                </div>
            </div>

            <div className={styles.profileSection}>
                <h2>Recent Applications</h2>
                {(!recentApplications || recentApplications.length === 0) ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 20 }}>
                        No applications yet. <Link to="/student/apply" style={{ color: 'var(--primary)', fontWeight: 600 }}>Browse Jobs</Link>
                    </p>
                ) : (
                    recentApplications.map(app => (
                        <div key={app._id} className={styles.appCard}>
                            <div className={styles.appInfo}>
                                <h4>{app.job?.title || 'Job'}</h4>
                                <p>{app.job?.company?.companyProfile?.companyName || 'Company'} • Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`badge badge-${app.stage === 'Selected' ? 'success' : app.stage === 'Rejected' ? 'error' : 'info'}`}>
                                {app.stage}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
