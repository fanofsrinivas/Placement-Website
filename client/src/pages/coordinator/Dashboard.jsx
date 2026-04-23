import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiBriefcase, FiUsers, FiCheckCircle, FiActivity, FiCalendar } from 'react-icons/fi';
import dashStyles from '../Dashboard.module.css';

const Dashboard = () => {
    const { api } = useAuth();
    const [stats, setStats] = useState(null);
    const [deptStats, setDeptStats] = useState(null);
    const [recentDrives, setRecentDrives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/coordinator/dashboard');
                setStats(res.data.stats);
                setDeptStats(res.data.departmentStats);
                setRecentDrives(res.data.recentDrives || []);
            } catch (err) {
                toast.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [api]);

    if (loading) return <div className={dashStyles.loading}>Loading dashboard...</div>;

    const statCards = [
        { label: 'Assigned Drives', value: stats?.assignedDrives || 0, icon: <FiCalendar />, color: '#6366f1' },
        { label: 'Active Drives', value: stats?.activeDrives || 0, icon: <FiActivity />, color: '#10b981' },
        { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: <FiBriefcase />, color: '#f59e0b' },
        { label: 'Pending Jobs', value: stats?.pendingJobs || 0, icon: <FiTrendingUp />, color: '#ef4444' },
        { label: 'Applications', value: stats?.totalApplications || 0, icon: <FiUsers />, color: '#8b5cf6' },
        { label: 'Selected', value: stats?.selectedApplications || 0, icon: <FiCheckCircle />, color: '#059669' },
    ];

    return (
        <div className={dashStyles.dashboardPage}>
            <div className={dashStyles.dashboardHeader}>
                <h1>Coordinator Dashboard</h1>
                <p>Manage placement drives, job postings, and application data</p>
            </div>

            <div className={dashStyles.statsGrid}>
                {statCards.map((card, i) => (
                    <div key={i} className={dashStyles.statCard} style={{ borderTop: `3px solid ${card.color}` }}>
                        <div className={dashStyles.statIcon} style={{ color: card.color }}>{card.icon}</div>
                        <div className={dashStyles.statInfo}>
                            <h3>{card.value}</h3>
                            <p>{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {deptStats && (
                <div style={{
                    background: 'linear-gradient(135deg, #ede9fe, #f5f3ff)', borderRadius: 12,
                    padding: '20px 24px', marginBottom: 24, border: '1px solid #ddd6fe',
                }}>
                    <h3 style={{ margin: '0 0 12px', fontSize: 16, color: '#5b21b6' }}>
                        📊 Department Overview — {deptStats.departments.join(', ')}
                    </h3>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                        <div>
                            <span style={{ fontSize: 28, fontWeight: 700, color: '#5b21b6' }}>{deptStats.totalStudents}</span>
                            <p style={{ margin: 0, fontSize: 13, color: '#7c3aed' }}>Total Students</p>
                        </div>
                        <div>
                            <span style={{ fontSize: 28, fontWeight: 700, color: '#059669' }}>{deptStats.placedStudents}</span>
                            <p style={{ margin: 0, fontSize: 13, color: '#059669' }}>Placed</p>
                        </div>
                        <div>
                            <span style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>{deptStats.placementRate}%</span>
                            <p style={{ margin: 0, fontSize: 13, color: '#d97706' }}>Placement Rate</p>
                        </div>
                    </div>
                </div>
            )}

            {recentDrives.length > 0 && (
                <div className={dashStyles.recentSection}>
                    <h2>Recent Drives</h2>
                    <div className={dashStyles.tableWrapper}>
                        <table className={dashStyles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Academic Year</th>
                                    <th>Status</th>
                                    <th>Start Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentDrives.map((drive) => (
                                    <tr key={drive._id}>
                                        <td>{drive.title}</td>
                                        <td>{drive.academicYear}</td>
                                        <td>
                                            <span className={`${dashStyles.badge} ${dashStyles[drive.status]}`}>
                                                {drive.status}
                                            </span>
                                        </td>
                                        <td>{new Date(drive.startDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
