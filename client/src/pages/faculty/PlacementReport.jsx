import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiDownload, FiAward, FiTrendingUp, FiDollarSign, FiBriefcase, FiBarChart2 } from 'react-icons/fi';
import dashStyles from '../Dashboard.module.css';

const PlacementReport = () => {
    const { api } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await api.get('/faculty/placements');
                setData(res.data);
            } catch (err) {
                toast.error('Failed to load placement report');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [api]);

    const handleExport = async () => {
        try {
            const res = await api.get('/faculty/placements/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Placement_Report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Report exported!');
        } catch (err) {
            toast.error('Export failed');
        }
    };

    if (loading) return <div className={dashStyles.loading}>Loading placement report...</div>;
    if (!data) return <div className={dashStyles.loading}>No data available</div>;

    const statCards = [
        { label: 'Total Placed', value: data.stats?.totalPlaced || 0, icon: <FiAward />, color: '#10b981' },
        { label: 'Avg Package', value: `${data.stats?.avgPackage || 0} LPA`, icon: <FiTrendingUp />, color: '#6366f1' },
        { label: 'Highest Package', value: `${data.stats?.maxPackage || 0} LPA`, icon: <FiDollarSign />, color: '#f59e0b' },
        { label: 'Companies', value: data.stats?.totalCompanies || 0, icon: <FiBriefcase />, color: '#8b5cf6' },
    ];

    return (
        <div className={dashStyles.dashboardPage}>
            <div className={dashStyles.dashboardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Placement Report</h1>
                    <p>Department placement statistics and analytics</p>
                </div>
                <button onClick={handleExport} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiDownload /> Export Report
                </button>
            </div>

            {/* Stats Cards */}
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

            {/* Additional Stats */}
            <div style={{
                display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap',
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #fdf4ff, #fae8ff)', padding: '14px 20px',
                    borderRadius: 10, border: '1px solid #e9d5ff', flex: 1, minWidth: 150,
                }}>
                    <div style={{ fontSize: 11, color: '#7e22ce', fontWeight: 600, marginBottom: 4 }}>Lowest Package</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#7e22ce' }}>{data.stats?.minPackage || 0} LPA</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', padding: '14px 20px',
                    borderRadius: 10, border: '1px solid #fed7aa', flex: 1, minWidth: 150,
                }}>
                    <div style={{ fontSize: 11, color: '#c2410c', fontWeight: 600, marginBottom: 4 }}>Median Package</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#c2410c' }}>{data.stats?.medianPackage || 0} LPA</div>
                </div>
            </div>

            {/* Branch Breakdown */}
            {data.branchBreakdown?.length > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', borderRadius: 12,
                    padding: '20px 24px', marginBottom: 24, border: '1px solid #a7f3d0',
                }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#065f46', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiBarChart2 /> Branch-wise Placement
                    </h3>
                    <div className={dashStyles.tableWrapper}>
                        <table className={dashStyles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Branch</th>
                                    <th>Placed</th>
                                    <th>Avg Package (LPA)</th>
                                    <th>Max Package (LPA)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.branchBreakdown.map((b) => (
                                    <tr key={b.branch}>
                                        <td style={{ fontWeight: 600 }}>{b.branch}</td>
                                        <td>
                                            <span style={{
                                                background: '#ecfdf5', color: '#065f46',
                                                padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                                            }}>
                                                {b.placed}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 600, color: '#6366f1' }}>{b.avgPackage}</td>
                                        <td style={{ fontWeight: 700, color: '#f59e0b' }}>{b.maxPackage}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Company Breakdown */}
            {data.companyBreakdown?.length > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: 12,
                    padding: '20px 24px', marginBottom: 24, border: '1px solid #bfdbfe',
                }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FiBriefcase /> Company-wise Breakdown
                    </h3>
                    <div className={dashStyles.tableWrapper}>
                        <table className={dashStyles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Offers</th>
                                    <th>Avg Package (LPA)</th>
                                    <th>Max Package (LPA)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.companyBreakdown.map((c) => (
                                    <tr key={c.company}>
                                        <td style={{ fontWeight: 600 }}>{c.company}</td>
                                        <td>
                                            <span style={{
                                                background: '#dbeafe', color: '#1e40af',
                                                padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                                            }}>
                                                {c.offers}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 600, color: '#6366f1' }}>{c.avgPackage}</td>
                                        <td style={{ fontWeight: 700, color: '#f59e0b' }}>{c.maxPackage}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Placed Students List */}
            {data.students?.length > 0 && (
                <div className={dashStyles.recentSection}>
                    <h2>All Placed Students</h2>
                    <div className={dashStyles.tableWrapper}>
                        <table className={dashStyles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Roll No</th>
                                    <th>Branch</th>
                                    <th>Degree</th>
                                    <th>CGPA</th>
                                    <th>Company</th>
                                    <th>Package (LPA)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.students.map((s, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                                        <td>{s.rollNumber}</td>
                                        <td style={{ fontSize: 12 }}>{s.branch}</td>
                                        <td>{s.degree}</td>
                                        <td>
                                            <span style={{
                                                fontWeight: 700,
                                                color: s.cgpa >= 8 ? '#10b981' : s.cgpa >= 6 ? '#f59e0b' : '#ef4444',
                                            }}>
                                                {s.cgpa}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                background: '#ecfdf5', color: '#065f46',
                                                padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 600,
                                            }}>
                                                {s.company}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 700, color: '#6366f1' }}>{s.package}</td>
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

export default PlacementReport;
