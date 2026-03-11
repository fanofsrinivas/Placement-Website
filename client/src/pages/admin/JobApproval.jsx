import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from '../Dashboard.module.css';

const JobApproval = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [expandedJob, setExpandedJob] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/job-approvals?page=${page}&limit=10`);
            setJobs(res.data.jobs);
            setTotalPages(res.data.totalPages);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchJobs(); }, [page]);

    const handleAction = async (id, action, reason = '') => {
        try {
            await api.put(`/admin/job-approvals/${id}`, { action, reason });
            toast.success(`Job ${action}d!`);
            fetchJobs();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        }
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div>
            <div className="page-header">
                <h1>Job Approvals</h1>
                <p>Review and approve job postings from companies</p>
            </div>

            {jobs.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 40 }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No pending job approvals 🎉</p>
                </div>
            ) : (
                jobs.map(job => (
                    <div key={job._id} className={styles.jobCard}>
                        <div className={styles.jobHeader}>
                            <div>
                                <h3>{job.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                                    by {job.company?.companyProfile?.companyName || 'Company'} ({job.company?.email})
                                </p>
                            </div>
                            <span className="badge badge-warning">Pending</span>
                        </div>
                        <div className={styles.jobMeta}>
                            <span>💼 {job.jobType}</span>
                            <span>📍 {job.location || 'Remote'}</span>
                            <span>💰 {job.packageLPA?.min}–{job.packageLPA?.max || job.packageLPA?.min} LPA</span>
                            <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                        </div>

                        <button className="btn btn-sm btn-outline" style={{ marginBottom: 8 }}
                            onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)}>
                            {expandedJob === job._id ? 'Hide Details' : 'View Details'}
                        </button>

                        {expandedJob === job._id && (
                            <div style={{ background: '#f8f9fc', padding: 16, borderRadius: 8, margin: '8px 0', fontSize: 14 }}>
                                <p><strong>Description:</strong> {job.description}</p>
                                <p><strong>Branches:</strong> {job.eligibility?.branches?.join(', ') || 'All'}</p>
                                <p><strong>Min CGPA:</strong> {job.eligibility?.minCGPA || 'No restriction'}</p>
                                <p><strong>Max Backlogs:</strong> {job.eligibility?.maxBacklogs ?? 'No restriction'}</p>
                                <p><strong>Skills:</strong> {job.skills?.join(', ') || 'N/A'}</p>
                                <p><strong>Company Website:</strong> <a href={job.company?.companyProfile?.website} target="_blank" rel="noopener noreferrer">{job.company?.companyProfile?.website || 'N/A'}</a></p>
                                <p><strong>LinkedIn:</strong> <a href={job.company?.companyProfile?.linkedIn} target="_blank" rel="noopener noreferrer">{job.company?.companyProfile?.linkedIn || 'N/A'}</a></p>
                            </div>
                        )}

                        <div className={styles.jobActions}>
                            <button className="btn btn-sm btn-success" onClick={() => handleAction(job._id, 'approve')}>
                                ✓ Approve Job
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => {
                                const reason = prompt('Rejection reason:');
                                if (reason) handleAction(job._id, 'reject', reason);
                            }}>
                                ✕ Reject
                            </button>
                        </div>
                    </div>
                ))
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            )}
        </div>
    );
};

export default JobApproval;
