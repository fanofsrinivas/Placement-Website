import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from '../Dashboard.module.css';

const ApplyJob = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [applying, setApplying] = useState(null);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/student/jobs?page=${page}&limit=10&search=${search}`);
            setJobs(res.data.jobs);
            setTotalPages(res.data.totalPages);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobs(); }, [page, search]);

    const handleApply = async (jobId) => {
        setApplying(jobId);
        try {
            await api.post(`/student/apply/${jobId}`);
            toast.success('Applied successfully!');
            fetchJobs();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Application failed');
        } finally {
            setApplying(null);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Browse Jobs</h1>
                <p>Find and apply to eligible job openings</p>
            </div>

            <div className={styles.filters}>
                <input placeholder="Search jobs..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>

            {loading ? <LoadingSkeleton /> : (
                <>
                    {jobs.length === 0 ? (
                        <div className={styles.profileSection} style={{ textAlign: 'center', padding: 40 }}>
                            <p style={{ color: 'var(--text-secondary)' }}>No jobs available at the moment.</p>
                        </div>
                    ) : (
                        jobs.map(job => (
                            <div key={job._id} className={styles.jobCard}>
                                <div className={styles.jobHeader}>
                                    <div>
                                        <h3>{job.title}</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                                            {job.company?.companyProfile?.companyName || 'Company'}
                                        </p>
                                    </div>
                                    <span className={`badge badge-${job.isEligible ? 'success' : 'warning'}`}>
                                        {job.isEligible ? 'Eligible' : 'Not Eligible'}
                                    </span>
                                </div>
                                <div className={styles.jobMeta}>
                                    <span>📍 {job.location || 'Remote'}</span>
                                    <span>💼 {job.jobType}</span>
                                    <span>💰 {job.packageLPA?.min}–{job.packageLPA?.max || job.packageLPA?.min} LPA</span>
                                    <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                </div>
                                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                                    {job.description?.substring(0, 200)}...
                                </p>
                                {job.eligibility?.branches?.length > 0 && (
                                    <p style={{ fontSize: 13, color: 'var(--text-light)' }}>
                                        Branches: {job.eligibility.branches.join(', ')} | Min CGPA: {job.eligibility.minCGPA || 'N/A'}
                                    </p>
                                )}

                                {!job.isEligible && (
                                    <div className={styles.ineligibleBox}>
                                        <h4>You are not eligible for this job</h4>
                                        <ul>
                                            {job.ineligibilityReasons?.map((r, i) => <li key={i}>{r}</li>)}
                                        </ul>
                                    </div>
                                )}

                                <div className={styles.jobActions}>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleApply(job._id)}
                                        disabled={!job.isEligible || applying === job._id}
                                    >
                                        {applying === job._id ? 'Applying...' : job.isEligible ? 'Apply Now' : 'Ineligible'}
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
                </>
            )}
        </div>
    );
};

export default ApplyJob;
