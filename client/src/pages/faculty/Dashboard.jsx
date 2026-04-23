import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiUsers, FiCheckCircle, FiTrendingUp, FiAward, FiBarChart2, FiBookOpen } from 'react-icons/fi';
import dashStyles from '../Dashboard.module.css';

const Dashboard = () => {
    const { api } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/faculty/dashboard');
                setData(res.data);
            } catch (err) {
                toast.error('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [api]);

    if (loading) return <div className={dashStyles.loading}>Loading dashboard...</div>;
    if (!data) return <div className={dashStyles.loading}>No data available</div>;

    const statCards = [
        { label: 'Total Students', value: data.stats?.totalStudents || 0, icon: <FiUsers />, color: '#6366f1' },
        { label: 'Placed Students', value: data.stats?.placedStudents || 0, icon: <FiCheckCircle />, color: '#10b981' },
        { label: 'Placement Rate', value: `${data.stats?.placementRate || 0}%`, icon: <FiTrendingUp />, color: '#f59e0b' },
        { label: 'Verified Students', value: data.stats?.verifiedStudents || 0, icon: <FiAward />, color: '#8b5cf6' },
    ];

    return (
        <div className={dashStyles.dashboardPage}>
            <div className={dashStyles.dashboardHeader}>
                <h1>Faculty Dashboard</h1>
                <p>
                    Welcome, {data.facultyName || 'Faculty'}
                    {data.designation && <span style={{ marginLeft: 8, color: 'var(--text-light)', fontSize: 14 }}>({data.designation})</span>}
                </p>
                {data.departments?.length > 0 && (
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8,
                    }}>
                        {data.departments.map((dept) => (
                            <span key={dept} style={{
                                background: 'linear-gradient(135deg, #ede9fe, #f5f3ff)',
                                color: '#5b21b6',
                                padding: '4px 12px',
                                borderRadius: 20,
                                fontSize: 12,
                                fontWeight: 600,
                                border: '1px solid #ddd6fe',
                            }}>
                                {dept}
                            </span>
                        ))}
                    </div>
                )}
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

            {/* Department Breakdown */}
            {data.departmentBreakdown?.length > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', borderRadius: 12,
                    padding: '20px 24px', marginBottom: 24, border: '1px solid #a7f3d0',
                }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#065f46', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiBarChart2 /> Department Breakdown
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                        {data.departmentBreakdown.map((dept) => (
                            <div key={dept.department} style={{
                                background: '#fff', borderRadius: 10, padding: '14px 16px',
                                border: '1px solid #d1fae5',
                            }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#065f46', marginBottom: 8 }}>
                                    {dept.department}
                                </div>
                                <div style={{ display: 'flex', gap: 20 }}>
                                    <div>
                                        <span style={{ fontSize: 22, fontWeight: 700, color: '#6366f1' }}>{dept.totalStudents}</span>
                                        <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>Total</p>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: 22, fontWeight: 700, color: '#10b981' }}>{dept.placedStudents}</span>
                                        <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>Placed</p>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>{dept.placementRate}%</span>
                                        <p style={{ margin: 0, fontSize: 11, color: '#6b7280' }}>Rate</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Degree-wise Stats */}
            {data.degreeStats?.length > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, #fdf4ff, #fae8ff)', borderRadius: 12,
                    padding: '20px 24px', marginBottom: 24, border: '1px solid #e9d5ff',
                }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#7e22ce', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiBookOpen /> Degree-wise Statistics
                    </h3>
                    <div className={dashStyles.tableWrapper}>
                        <table className={dashStyles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Degree</th>
                                    <th>Total</th>
                                    <th>Placed</th>
                                    <th>Avg CGPA</th>
                                    <th>Placement %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.degreeStats.map((d) => (
                                    <tr key={d._id || 'unknown'}>
                                        <td>{d._id || 'N/A'}</td>
                                        <td>{d.total}</td>
                                        <td>{d.placed}</td>
                                        <td>{d.avgCgpa ? d.avgCgpa.toFixed(2) : 'N/A'}</td>
                                        <td>
                                            <span style={{
                                                color: d.total > 0 && (d.placed / d.total) > 0.5 ? '#10b981' : '#f59e0b',
                                                fontWeight: 600,
                                            }}>
                                                {d.total > 0 ? Math.round((d.placed / d.total) * 100) : 0}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Recent Placements */}
            {data.recentPlacements?.length > 0 && (
                <div className={dashStyles.recentSection}>
                    <h2>Recent Placements in Department</h2>
                    <div className={dashStyles.tableWrapper}>
                        <table className={dashStyles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Roll No</th>
                                    <th>Branch</th>
                                    <th>Company</th>
                                    <th>Package (LPA)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentPlacements.map((s, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600 }}>{s.name || 'N/A'}</td>
                                        <td>{s.rollNumber}</td>
                                        <td>{s.branch}</td>
                                        <td>
                                            <span style={{
                                                background: '#ecfdf5', color: '#065f46',
                                                padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600,
                                            }}>
                                                {s.company}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 700, color: '#6366f1' }}>{s.package || 'N/A'}</td>
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
