import { useEffect, useState } from 'react';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';

const TPODashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/tpo/dashboard')
            .then(res => setData(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSkeleton type="cards" />;

    const { stats } = data || {};

    return (
        <div>
            <div className="page-header">
                <h1>TPO Dashboard</h1>
                <p>Placement overview and management</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8eaf6', color: '#1a237e' }}>📁</div>
                    <div className="stat-info"><h3>{stats?.totalDrives || 0}</h3><p>Total Drives</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>🟢</div>
                    <div className="stat-info"><h3>{stats?.activeDrives || 0}</h3><p>Active Drives</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>👨‍🎓</div>
                    <div className="stat-info"><h3>{stats?.totalStudents || 0}</h3><p>Total Students</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fff3e0', color: '#e65100' }}>✅</div>
                    <div className="stat-info"><h3>{stats?.placedStudents || 0}</h3><p>Students Placed</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fce4ec', color: '#c62828' }}>🏢</div>
                    <div className="stat-info"><h3>{stats?.totalCompanies || 0}</h3><p>Companies</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f3e5f5', color: '#6a1b9a' }}>💰</div>
                    <div className="stat-info"><h3>{stats?.avgPackage ? `${stats.avgPackage.toFixed(1)} LPA` : 'N/A'}</h3><p>Avg Package</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>🏆</div>
                    <div className="stat-info"><h3>{stats?.maxPackage ? `${stats.maxPackage} LPA` : 'N/A'}</h3><p>Highest Package</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>📊</div>
                    <div className="stat-info"><h3>{stats?.totalOffers || 0}</h3><p>Total Offers</p></div>
                </div>
            </div>
        </div>
    );
};

export default TPODashboard;
