import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from '../Dashboard.module.css';

const InterviewScheduler = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scheduleModal, setScheduleModal] = useState(null);
    const [schedule, setSchedule] = useState({ date: '', time: '', link: '', location: '', type: 'Online' });

    useEffect(() => {
        api.get('/company/jobs?limit=100').then(res => {
            setJobs(res.data.jobs);
            if (res.data.jobs.length > 0) setSelectedJob(res.data.jobs[0]._id);
        }).catch(() => { }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!selectedJob) return;
        api.get(`/company/jobs/${selectedJob}/candidates?stage=Tech Interview`)
            .then(res => setCandidates(res.data.applications || []))
            .catch(() => { });
    }, [selectedJob]);

    const handleSchedule = async () => {
        try {
            await api.put(`/company/applications/${scheduleModal}/interview`, schedule);
            toast.success('Interview scheduled!');
            setScheduleModal(null);
            // Refresh
            const res = await api.get(`/company/jobs/${selectedJob}/candidates?stage=Tech Interview`);
            setCandidates(res.data.applications || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Scheduling failed');
        }
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div>
            <div className="page-header">
                <h1>Interview Scheduler</h1>
                <p>Schedule and manage candidate interviews</p>
            </div>

            <div className={styles.filters}>
                <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)} style={{ minWidth: 300 }}>
                    {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr><th>Candidate</th><th>Email</th><th>Branch</th><th>CGPA</th><th>Interview</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                        {candidates.map(app => (
                            <tr key={app._id}>
                                <td style={{ fontWeight: 600 }}>
                                    {app.student?.studentProfile?.firstName || ''} {app.student?.studentProfile?.lastName || ''}
                                </td>
                                <td>{app.student?.email}</td>
                                <td>{app.student?.studentProfile?.branch}</td>
                                <td>{app.student?.studentProfile?.cgpa}</td>
                                <td>
                                    {app.interviewSchedule?.date ? (
                                        <span className="badge badge-success">
                                            {new Date(app.interviewSchedule.date).toLocaleDateString()} {app.interviewSchedule.time}
                                        </span>
                                    ) : (
                                        <span className="badge badge-warning">Not scheduled</span>
                                    )}
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary" onClick={() => setScheduleModal(app._id)}>
                                        Schedule
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {candidates.length === 0 && (
                            <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No candidates in interview stage</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {scheduleModal && (
                <div className={styles.modalOverlay} onClick={() => setScheduleModal(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2>Schedule Interview</h2>
                        <div className="form-group">
                            <label>Date</label>
                            <input type="date" value={schedule.date} onChange={e => setSchedule({ ...schedule, date: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Time</label>
                            <input type="time" value={schedule.time} onChange={e => setSchedule({ ...schedule, time: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select value={schedule.type} onChange={e => setSchedule({ ...schedule, type: e.target.value })}>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>{schedule.type === 'Online' ? 'Meeting Link' : 'Location'}</label>
                            <input
                                value={schedule.type === 'Online' ? schedule.link : schedule.location}
                                onChange={e => setSchedule({ ...schedule, [schedule.type === 'Online' ? 'link' : 'location']: e.target.value })}
                                placeholder={schedule.type === 'Online' ? 'https://meet.google.com/...' : 'Room 301, CCPD Block'}
                            />
                        </div>
                        <div className={styles.modalActions}>
                            <button className="btn btn-outline" onClick={() => setScheduleModal(null)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSchedule}>Schedule</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewScheduler;
