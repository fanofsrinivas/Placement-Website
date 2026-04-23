import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiPlus, FiSearch } from 'react-icons/fi';
import dashStyles from '../Dashboard.module.css';

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

const degrees = ['B.Tech', 'M.Tech', 'MSc', 'MCA', 'PhD', 'Dual Degree', 'Integrated MSc'];
const jobTypes = ['Full-Time', 'Internship', '6-Month Internship + FTE', 'PPO'];

const emptyJob = {
    driveId: '', companyId: '', title: '', description: '', jobType: 'Full-Time',
    location: '', packageLPA: { min: '', max: '' }, stipend: '',
    eligibility: { branches: [], minCGPA: 0, maxBacklogs: 0, degrees: [], passingYears: [], gender: 'All' },
    skills: '', deadline: '',
};

const JobPostings = () => {
    const { api } = useAuth();
    const [drives, setDrives] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ ...emptyJob });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [drivesRes, companiesRes] = await Promise.all([
                    api.get('/coordinator/drives'),
                    api.get('/coordinator/companies'),
                ]);
                setDrives(drivesRes.data.drives || []);
                setCompanies(companiesRes.data.companies || []);
            } catch (err) {
                toast.error('Failed to load data');
            }
        };
        fetchData();
    }, [api]);

    const toggleBranch = (branch) => {
        const current = form.eligibility.branches || [];
        const updated = current.includes(branch) ? current.filter(b => b !== branch) : [...current, branch];
        setForm({ ...form, eligibility: { ...form.eligibility, branches: updated } });
    };

    const toggleAllBranches = () => {
        const allSelected = form.eligibility.branches.length === branches.length;
        setForm({ ...form, eligibility: { ...form.eligibility, branches: allSelected ? [] : [...branches] } });
    };

    const toggleDegree = (deg) => {
        const current = form.eligibility.degrees || [];
        const updated = current.includes(deg) ? current.filter(d => d !== deg) : [...current, deg];
        setForm({ ...form, eligibility: { ...form.eligibility, degrees: updated } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...form,
                packageLPA: { min: parseFloat(form.packageLPA.min) || 0, max: parseFloat(form.packageLPA.max) || undefined },
                stipend: form.stipend ? parseFloat(form.stipend) : undefined,
                skills: form.skills ? form.skills.split(',').map(s => s.trim()) : [],
            };
            await api.post('/coordinator/jobs', payload);
            toast.success('Job posted! Awaiting admin/TPO approval.');
            setShowForm(false);
            setForm({ ...emptyJob });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={dashStyles.dashboardPage}>
            <div className={dashStyles.dashboardHeader}>
                <h1>Job Postings</h1>
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setForm({ ...emptyJob }); }}>
                    <FiPlus /> {showForm ? 'Cancel' : 'Post New Job'}
                </button>
            </div>

            {showForm && (
                <div className={dashStyles.formCard}>
                    <h2>Create Job Posting</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label>Select Drive</label>
                                <select value={form.driveId} onChange={(e) => setForm({ ...form, driveId: e.target.value })}>
                                    <option value="">-- None --</option>
                                    {drives.map(d => <option key={d._id} value={d._id}>{d.title} ({d.academicYear})</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Company</label>
                                <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
                                    <option value="">-- Select Company --</option>
                                    {companies.map(c => <option key={c._id} value={c._id}>{c.companyProfile?.companyName || c.email}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Job Title *</label>
                            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Software Engineer" />
                        </div>

                        <div className="form-group">
                            <label>Description *</label>
                            <textarea rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Job description, responsibilities, requirements..." />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label>Job Type *</label>
                                <select value={form.jobType} onChange={(e) => setForm({ ...form, jobType: e.target.value })}>
                                    {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Hyderabad" />
                            </div>
                            <div className="form-group">
                                <label>Deadline *</label>
                                <input type="date" required value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label>Package Min (LPA) *</label>
                                <input type="number" step="0.1" required value={form.packageLPA.min} onChange={(e) => setForm({ ...form, packageLPA: { ...form.packageLPA, min: e.target.value } })} placeholder="e.g. 6" />
                            </div>
                            <div className="form-group">
                                <label>Package Max (LPA)</label>
                                <input type="number" step="0.1" value={form.packageLPA.max} onChange={(e) => setForm({ ...form, packageLPA: { ...form.packageLPA, max: e.target.value } })} placeholder="e.g. 12" />
                            </div>
                            <div className="form-group">
                                <label>Stipend (₹/month)</label>
                                <input type="number" value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} placeholder="For internships" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Skills (comma separated)</label>
                            <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="e.g. React, Node.js, Python" />
                        </div>

                        <div className="form-group">
                            <label>
                                Eligible Branches
                                <button type="button" onClick={toggleAllBranches} style={{
                                    marginLeft: 12, background: 'none', border: '1px solid var(--primary)',
                                    color: 'var(--primary)', borderRadius: 4, padding: '2px 8px', fontSize: 12, cursor: 'pointer',
                                }}>
                                    {form.eligibility.branches.length === branches.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 6, maxHeight: 220, overflowY: 'auto', padding: 8, border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-secondary, #f8fafc)' }}>
                                {branches.map((b) => (
                                    <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={form.eligibility.branches.includes(b)} onChange={() => toggleBranch(b)} />
                                        {b}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Eligible Degrees</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                {degrees.map((d) => (
                                    <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={(form.eligibility.degrees || []).includes(d)} onChange={() => toggleDegree(d)} />
                                        {d}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label>Min CGPA</label>
                                <input type="number" step="0.1" min="0" max="10" value={form.eligibility.minCGPA} onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, minCGPA: parseFloat(e.target.value) || 0 } })} />
                            </div>
                            <div className="form-group">
                                <label>Max Backlogs</label>
                                <input type="number" min="0" value={form.eligibility.maxBacklogs} onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, maxBacklogs: parseInt(e.target.value) || 0 } })} />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select value={form.eligibility.gender} onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, gender: e.target.value } })}>
                                    <option value="All">All</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={loading}>
                            {loading ? 'Posting...' : 'Post Job (Awaits Approval)'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default JobPostings;
