import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import pageStyles from '../public/Public.module.css';

const COLORS = ['#1a237e', '#283593', '#3949ab', '#5c6bc0', '#7986cb', '#9fa8da', '#ffc107', '#ff9800', '#4caf50', '#2196f3', '#e91e63', '#00bcd4'];

const PlacementAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/tpo/analytics')
            .then(res => setData(res.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSkeleton />;

    const branchData = data?.branchWise?.map(b => ({
        name: b._id || 'Other',
        placed: b.placed,
        avgPackage: parseFloat((b.avgPackage || 0).toFixed(2)),
        maxPackage: parseFloat((b.maxPackage || 0).toFixed(2)),
    })) || [];

    const yearData = data?.yearWise?.map(y => ({
        name: String(y._id),
        placed: y.placed,
        avgPackage: parseFloat((y.avgPackage || 0).toFixed(2)),
        maxPackage: parseFloat((y.maxPackage || 0).toFixed(2)),
    })) || [];

    const companyData = data?.companyWise?.map(c => ({
        name: c._id || 'Unknown',
        offers: c.offers,
        avgPackage: parseFloat((c.avgPackage || 0).toFixed(2)),
    })) || [];

    const noData = branchData.length === 0 && yearData.length === 0;

    return (
        <div>
            <div className="page-header">
                <h1>Placement Analytics</h1>
                <p>Year-on-year trends, branch-wise, and company-wise analytics</p>
            </div>

            {noData ? (
                <div className="card" style={{ textAlign: 'center', padding: 60 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📊</div>
                    <h3>No Placement Data Yet</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Import legacy data or wait for placements to see analytics here.</p>
                </div>
            ) : (
                <div className={pageStyles.chartsGrid}>
                    {branchData.length > 0 && (
                        <>
                            <div className={pageStyles.chartCard}>
                                <h3>Branch-wise Placements</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={branchData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="placed" fill="#1a237e" radius={[4, 4, 0, 0]} name="Students Placed" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={pageStyles.chartCard}>
                                <h3>Branch-wise Avg Package (LPA)</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={branchData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="avgPackage" fill="#ffc107" radius={[4, 4, 0, 0]} name="Avg Package" />
                                        <Bar dataKey="maxPackage" fill="#4caf50" radius={[4, 4, 0, 0]} name="Max Package" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={pageStyles.chartCard}>
                                <h3>Branch Distribution</h3>
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
                        </>
                    )}

                    {yearData.length > 0 && (
                        <div className={pageStyles.chartCard}>
                            <h3>Year-on-Year Placement Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={yearData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="placed" stroke="#1a237e" strokeWidth={3} name="Students Placed" />
                                    <Line type="monotone" dataKey="avgPackage" stroke="#ffc107" strokeWidth={2} name="Avg Package (LPA)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {companyData.length > 0 && (
                        <div className={pageStyles.chartCard} style={{ gridColumn: 'span 2' }}>
                            <h3>Top Recruiting Companies</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={companyData.slice(0, 10)} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={120} fontSize={12} />
                                    <Tooltip />
                                    <Bar dataKey="offers" fill="#1a237e" radius={[0, 4, 4, 0]} name="Offers" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlacementAnalytics;
