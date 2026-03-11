import { useEffect, useState } from 'react';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/dashboard')
            .then(res => setData(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSkeleton type="cards" />;

    const { stats, recentLogs } = data || {};

    return (
        <div>
            <div className="page-header">
                <h1>Admin Dashboard</h1>
                <p>System overview and management</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8eaf6', color: '#1a237e' }}>👨‍🎓</div>
                    <div className="stat-info"><h3>{stats?.totalStudents || 0}</h3><p>Students</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fff3e0', color: '#e65100' }}>🏢</div>
                    <div className="stat-info"><h3>{stats?.totalCompanies || 0}</h3><p>Companies</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fce4ec', color: '#c62828' }}>⏳</div>
                    <div className="stat-info"><h3>{stats?.pendingVerifications || 0}</h3><p>Pending Verifications</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>📋</div>
                    <div className="stat-info"><h3>{stats?.pendingJobs || 0}</h3><p>Pending Jobs</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>✅</div>
                    <div className="stat-info"><h3>{stats?.totalPlaced || 0}</h3><p>Total Placed</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f3e5f5', color: '#6a1b9a' }}>📝</div>
                    <div className="stat-info"><h3>{stats?.totalApplications || 0}</h3><p>Applications</p></div>
                </div>
            </div>

            <div className="card">
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recent Activity</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>Action</th><th>User</th><th>Role</th><th>Time</th></tr>
                        </thead>
                        <tbody>
                            {(recentLogs || []).map(log => (
                                <tr key={log._id}>
                                    <td><span className="badge badge-primary">{log.action.replace(/_/g, ' ')}</span></td>
                                    <td>{log.actor?.email || 'System'}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{log.actor?.role}</td>
                                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
