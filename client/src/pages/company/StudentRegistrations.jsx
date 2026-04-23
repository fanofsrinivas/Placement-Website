import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from '../Dashboard.module.css';

const stages = ['Applied', 'Screening', 'Test', 'Tech Interview', 'HR', 'Selected', 'Rejected'];
const stageColors = {
    Applied: '#6366f1', Screening: '#f59e0b', Test: '#8b5cf6',
    'Tech Interview': '#3b82f6', HR: '#ec4899', Selected: '#10b981', Rejected: '#ef4444',
};

const StudentRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [jobFilter, setJobFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedRow, setExpandedRow] = useState(null);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 50 };
            if (search) params.search = search;
            if (stageFilter) params.stage = stageFilter;
            if (jobFilter) params.jobId = jobFilter;
            if (branchFilter) params.branch = branchFilter;
            const res = await api.get('/company/registrations', { params });
            setRegistrations(res.data.registrations || []);
            setJobs(res.data.jobs || []);
            setTotal(res.data.total || 0);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            toast.error('Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRegistrations(); }, [page, stageFilter, jobFilter, branchFilter]);

    useEffect(() => {
        const timer = setTimeout(() => { setPage(1); fetchRegistrations(); }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handleExport = async () => {
        try {
            const res = await api.get('/company/registrations/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Student_Registrations.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Export downloaded!');
        } catch (err) {
            toast.error('Export failed');
        }
    };

    // Get unique branches from data
    const branches = [...new Set(registrations.map(r => r.branch).filter(Boolean))];

    if (loading && registrations.length === 0) return <LoadingSkeleton />;

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <h1>Student Registrations</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                        {total} total registrations across all your jobs
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleExport}>
                    📥 Export to Excel
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="🔍 Search by name, email, or roll number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1, minWidth: 250, padding: '10px 14px', borderRadius: 8,
                        border: '1px solid var(--border)', fontSize: 14,
                    }}
                />
                <select value={jobFilter} onChange={e => { setJobFilter(e.target.value); setPage(1); }}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}>
                    <option value="">All Jobs</option>
                    {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
                </select>
                <select value={stageFilter} onChange={e => { setStageFilter(e.target.value); setPage(1); }}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}>
                    <option value="">All Stages</option>
                    {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select value={branchFilter} onChange={e => { setBranchFilter(e.target.value); setPage(1); }}
                    style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}>
                    <option value="">All Branches</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                {['Applied', 'Screening', 'Selected', 'Rejected'].map(stage => {
                    const count = registrations.filter(r => r.stage === stage).length;
                    return (
                        <div key={stage} style={{
                            background: '#fff', borderRadius: 10, padding: '12px 20px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minWidth: 120,
                            borderLeft: `4px solid ${stageColors[stage]}`, cursor: 'pointer',
                        }} onClick={() => setStageFilter(stageFilter === stage ? '' : stage)}>
                            <div style={{ fontSize: 22, fontWeight: 700, color: stageColors[stage] }}>{count}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>{stage}</div>
                        </div>
                    );
                })}
            </div>

            {/* Table */}
            <div className="table-container" style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Roll No.</th>
                            <th>Branch</th>
                            <th>Degree</th>
                            <th>CGPA</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Job</th>
                            <th>Stage</th>
                            <th>Applied</th>
                            <th>Resume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.length === 0 ? (
                            <tr><td colSpan={11} style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                                No registrations found. Students will appear here once they apply to your jobs.
                            </td></tr>
                        ) : registrations.map((r) => (
                            <>
                                <tr key={r._id} onClick={() => setExpandedRow(expandedRow === r._id ? null : r._id)}
                                    style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                    <td style={{ fontWeight: 600 }}>{r.studentName || 'N/A'}</td>
                                    <td>{r.rollNumber || '-'}</td>
                                    <td style={{ fontSize: 12 }}>{r.branch || '-'}</td>
                                    <td>{r.degree || '-'}</td>
                                    <td style={{ fontWeight: 600 }}>{r.cgpa || '-'}</td>
                                    <td style={{ fontSize: 12 }}>{r.email}</td>
                                    <td>{r.phone || '-'}</td>
                                    <td style={{ fontSize: 12 }}>{r.jobTitle}</td>
                                    <td>
                                        <span style={{
                                            background: stageColors[r.stage] || '#6b7280',
                                            color: '#fff', padding: '3px 10px', borderRadius: 12,
                                            fontSize: 11, fontWeight: 600,
                                        }}>
                                            {r.stage}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 12 }}>{r.appliedDate ? new Date(r.appliedDate).toLocaleDateString() : '-'}</td>
                                    <td>
                                        {r.resumeUrl ? (
                                            <a href={r.resumeUrl} target="_blank" rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 12 }}>
                                                View
                                            </a>
                                        ) : <span style={{ color: '#999', fontSize: 12 }}>N/A</span>}
                                    </td>
                                </tr>
                                {expandedRow === r._id && (
                                    <tr key={`${r._id}-detail`}>
                                        <td colSpan={11} style={{ background: '#f8fafc', padding: '16px 24px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>Gender</strong>
                                                    <p style={{ margin: '2px 0' }}>{r.gender || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>Active Backlogs</strong>
                                                    <p style={{ margin: '2px 0' }}>{r.activeBacklogs}</p>
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>10th %</strong>
                                                    <p style={{ margin: '2px 0' }}>{r.tenthPercentage || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>12th %</strong>
                                                    <p style={{ margin: '2px 0' }}>{r.twelfthPercentage || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>Placement Status</strong>
                                                    <p style={{ margin: '2px 0' }}>{r.isPlaced ? `Placed at ${r.placedCompany}` : 'Not placed'}</p>
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>Job Type</strong>
                                                    <p style={{ margin: '2px 0' }}>{r.jobType || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                    <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>Page {page} of {totalPages}</span>
                    <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            )}
        </div>
    );
};

export default StudentRegistrations;
