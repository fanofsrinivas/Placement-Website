import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';

const CompanyDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/company/dashboard')
            .then(res => setData(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSkeleton type="cards" />;

    const { stats, recentJobs } = data || {};

    return (
        <div>
            <div className="page-header">
                <h1>Company Dashboard</h1>
                <p>Your recruitment overview at NIT Warangal</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8eaf6', color: '#1a237e' }}>📋</div>
                    <div className="stat-info"><h3>{stats?.totalJobs || 0}</h3><p>Total Jobs</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>✅</div>
                    <div className="stat-info"><h3>{stats?.activeJobs || 0}</h3><p>Active Jobs</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fff3e0', color: '#e65100' }}>⏳</div>
                    <div className="stat-info"><h3>{stats?.pendingJobs || 0}</h3><p>Pending Approval</p></div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#e3f2fd', color: '#1565c0' }}>👥</div>
                    <div className="stat-info"><h3>{stats?.totalApplications || 0}</h3><p>Applications</p></div>
                </div>
            </div>

            <div className="card" style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Job Postings</h2>
                    <Link to="/company/jobs" className="btn btn-primary btn-sm">Manage Jobs</Link>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Applications</th>
                                <th>Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(recentJobs || []).map(job => (
                                <tr key={job._id}>
                                    <td style={{ fontWeight: 600 }}>{job.title}</td>
                                    <td>{job.jobType}</td>
                                    <td><span className={`badge badge-${job.status === 'approved' ? 'success' : job.status === 'pending' ? 'warning' : 'error'}`}>{job.status}</span></td>
                                    <td>{job.applicantCount || 0}</td>
                                    <td>{new Date(job.deadline).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {(!recentJobs || recentJobs.length === 0) && (
                                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No jobs posted yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
