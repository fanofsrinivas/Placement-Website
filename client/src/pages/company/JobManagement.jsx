import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from '../Dashboard.module.css';

const branches = [
    'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering',
    'Electronics and Communication Engineering', 'Metallurgical and Materials Engineering',
    'Chemical Engineering', 'Computer Science and Engineering', 'Biotechnology',
    'Electronics and Communication Engineering (VLSI Design and Technology)',
    'Mathematics and Computing',
    'Computer Science and Engineering (Artificial Intelligence & Data Science)',
    'Integrated M.Sc. Mathematics', 'Integrated M.Sc. Physics', 'Integrated M.Sc. Chemistry',
    'Dual Degree - Chemical Engineering', 'Dual Degree - Metallurgical and Materials Engineering',
    'Other',
];
const jobTypes = ['Full-Time', 'Internship', '6-Month Internship + FTE', 'PPO'];

const emptyJob = {
    title: '', description: '', jobType: 'Full-Time', location: '', deadline: '',
    packageLPA: { min: '', max: '' }, stipend: '',
    eligibility: { branches: [], minCGPA: '', maxBacklogs: 0, degrees: [], passingYears: [] },
    skills: '',
};

const JobManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ ...emptyJob });
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchJobs = async () => {
        try {
            const res = await api.get(`/company/jobs?page=${page}&limit=10`);
            setJobs(res.data.jobs);
            setTotalPages(res.data.totalPages);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchJobs(); }, [page]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...form,
                packageLPA: { min: parseFloat(form.packageLPA.min), max: parseFloat(form.packageLPA.max) || undefined },
                stipend: form.stipend ? parseFloat(form.stipend) : undefined,
                skills: typeof form.skills === 'string' ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : form.skills,
                eligibility: {
                    ...form.eligibility,
                    minCGPA: parseFloat(form.eligibility.minCGPA) || 0,
                    maxBacklogs: parseInt(form.eligibility.maxBacklogs) || 0,
                },
            };

            if (editId) {
                await api.put(`/company/jobs/${editId}`, payload);
                toast.success('Job updated!');
            } else {
                await api.post('/company/jobs', payload);
                toast.success('Job posted! Awaiting admin approval.');
            }
            setShowModal(false);
            setForm({ ...emptyJob });
            setEditId(null);
            fetchJobs();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (job) => {
        setForm({
            ...job,
            skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
            deadline: job.deadline ? job.deadline.split('T')[0] : '',
        });
        setEditId(job._id);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this job?')) return;
        try {
            await api.delete(`/company/jobs/${id}`);
            toast.success('Job deleted');
            fetchJobs();
        } catch { toast.error('Delete failed'); }
    };

    const downloadJAF = async (id) => {
        try {
            const res = await api.get(`/company/jobs/${id}/jaf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = url; a.download = `JAF_${id}.pdf`; a.click();
            toast.success('JAF downloaded!');
        } catch { toast.error('Download failed'); }
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><h1>Job Postings</h1><p>Manage your job listings</p></div>
                <button className="btn btn-primary" onClick={() => { setForm({ ...emptyJob }); setEditId(null); setShowModal(true); }}>
                    + Post New Job
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr><th>Title</th><th>Type</th><th>Package</th><th>Status</th><th>Applicants</th><th>Deadline</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job._id}>
                                <td style={{ fontWeight: 600 }}>{job.title}</td>
                                <td>{job.jobType}</td>
                                <td>{job.packageLPA?.min}–{job.packageLPA?.max || job.packageLPA?.min} LPA</td>
                                <td><span className={`badge badge-${job.status === 'approved' ? 'success' : job.status === 'pending' ? 'warning' : 'error'}`}>{job.status}</span></td>
                                <td>{job.applicantCount || 0}</td>
                                <td>{new Date(job.deadline).toLocaleDateString()}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button className="btn btn-sm btn-outline" onClick={() => handleEdit(job)}>Edit</button>
                                        <button className="btn btn-sm btn-primary" onClick={() => downloadJAF(job._id)}>JAF</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(job._id)}>×</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            )}

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2>{editId ? 'Edit Job' : 'Post New Job'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Job Title *</label>
                                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Software Engineer" />
                            </div>
                            <div className="form-group">
                                <label>Description *</label>
                                <textarea rows={4} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Job description..." />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <label>Job Type *</label>
                                    <select value={form.jobType} onChange={e => setForm({ ...form, jobType: e.target.value })}>
                                        {jobTypes.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Location</label>
                                    <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Bangalore" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <label>Min Package (LPA) *</label>
                                    <input type="number" required value={form.packageLPA.min} onChange={e => setForm({ ...form, packageLPA: { ...form.packageLPA, min: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>Max Package (LPA)</label>
                                    <input type="number" value={form.packageLPA.max} onChange={e => setForm({ ...form, packageLPA: { ...form.packageLPA, max: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>Stipend (₹/month)</label>
                                    <input type="number" value={form.stipend} onChange={e => setForm({ ...form, stipend: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Deadline *</label>
                                <input type="date" required value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Eligible Branches</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                                    {branches.map(b => (
                                        <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                                            <input type="checkbox" checked={form.eligibility.branches.includes(b)}
                                                onChange={e => {
                                                    const bs = e.target.checked
                                                        ? [...form.eligibility.branches, b]
                                                        : form.eligibility.branches.filter(x => x !== b);
                                                    setForm({ ...form, eligibility: { ...form.eligibility, branches: bs } });
                                                }}
                                            /> {b}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="form-group">
                                    <label>Min CGPA</label>
                                    <input type="number" step="0.1" min="0" max="10" value={form.eligibility.minCGPA} onChange={e => setForm({ ...form, eligibility: { ...form.eligibility, minCGPA: e.target.value } })} />
                                </div>
                                <div className="form-group">
                                    <label>Max Backlogs Allowed</label>
                                    <input type="number" min="0" value={form.eligibility.maxBacklogs} onChange={e => setForm({ ...form, eligibility: { ...form.eligibility, maxBacklogs: e.target.value } })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Skills (comma-separated)</label>
                                <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, Python" />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editId ? 'Update Job' : 'Post Job')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobManagement;
