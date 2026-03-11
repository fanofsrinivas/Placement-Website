import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from './Public.module.css';

const COLORS = ['#1a237e', '#283593', '#3949ab', '#5c6bc0', '#7986cb', '#9fa8da', '#c5cae9', '#ffc107', '#ff9800', '#4caf50', '#2196f3', '#e91e63'];

const PlacementStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/public/stats')
            .then(res => setStats(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSkeleton />;

    const branchData = stats?.branchWise?.map(b => ({
        name: b._id || 'Other',
        placed: b.count,
        avgPackage: parseFloat((b.avgPackage || 0).toFixed(2)),
    })) || [];

    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
                <h2>Placement Statistics</h2>
                <p>Real-time placement data from NIT Warangal</p>
                <div className={styles.accent}></div>
            </div>

            <div className="stats-grid container" style={{ marginBottom: 40 }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8eaf6', color: '#1a237e' }}>🎓</div>
                    <div className="stat-info">
                        <h3>{stats?.totalStudents || 0}</h3>
                        <p>Total Students</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>✅</div>
                    <div className="stat-info">
                        <h3>{stats?.placedStudents || 0}</h3>
                        <p>Students Placed</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fff3e0', color: '#e65100' }}>🏢</div>
                    <div className="stat-info">
                        <h3>{stats?.totalCompanies || 0}</h3>
                        <p>Companies</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fce4ec', color: '#c62828' }}>💰</div>
                    <div className="stat-info">
                        <h3>{stats?.maxPackage ? `${stats.maxPackage} LPA` : 'N/A'}</h3>
                        <p>Highest Package</p>
                    </div>
                </div>
            </div>

            {branchData.length > 0 && (
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <h3>Branch-wise Placements</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={branchData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="placed" fill="#1a237e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={styles.chartCard}>
                        <h3>Branch-wise Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={branchData} dataKey="placed" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {branchData.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlacementStats;
