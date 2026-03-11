import { useEffect, useState } from 'react';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from '../Dashboard.module.css';

const stageBadge = { Applied: 'info', Screening: 'primary', Test: 'warning', 'Tech Interview': 'info', HR: 'warning', Selected: 'success', Rejected: 'error' };

const MyApplications = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        api.get(`/student/applications?page=${page}&limit=10`)
            .then(res => {
                setApps(res.data.applications);
                setTotalPages(res.data.totalPages);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [page]);

    if (loading) return <LoadingSkeleton />;

    return (
        <div>
            <div className="page-header">
                <h1>My Applications</h1>
                <p>Track your job applications and interview status</p>
            </div>

            {apps.length === 0 ? (
                <div className={styles.profileSection} style={{ textAlign: 'center', padding: 40 }}>
                    <p style={{ color: 'var(--text-secondary)' }}>No applications yet. Start applying!</p>
                </div>
            ) : (
                apps.map(app => (
                    <div key={app._id} className={styles.appCard}>
                        <div className={styles.appInfo}>
                            <h4>{app.job?.title || 'Job'}</h4>
                            <p>
                                {app.job?.company?.companyProfile?.companyName || 'Company'} •
                                Applied {new Date(app.createdAt).toLocaleDateString()}
                            </p>
                            {app.interviewSchedule?.date && (
                                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 13, marginTop: 4 }}>
                                    🗓 Interview: {new Date(app.interviewSchedule.date).toLocaleDateString()} at {app.interviewSchedule.time}
                                    {app.interviewSchedule.link && <> | <a href={app.interviewSchedule.link} target="_blank" rel="noopener noreferrer">Join Link</a></>}
                                </p>
                            )}
                        </div>
                        <span className={`badge badge-${stageBadge[app.stage] || 'info'}`}>{app.stage}</span>
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

export default MyApplications;
