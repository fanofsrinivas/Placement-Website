import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../context/AuthContext';

const SERVER_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api$/, '');
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from '../Dashboard.module.css';

const branches = [
    'Civil Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Electronics and Communication Engineering',
    'Metallurgical and Materials Engineering',
    'Chemical Engineering',
    'Computer Science and Engineering',
    'Biotechnology',
    'Electronics and Communication Engineering (VLSI Design and Technology)',
    'Mathematics and Computing',
    'Computer Science and Engineering (Artificial Intelligence & Data Science)',
    'Integrated M.Sc. Mathematics',
    'Integrated M.Sc. Physics',
    'Integrated M.Sc. Chemistry',
    'Dual Degree - Chemical Engineering',
    'Dual Degree - Metallurgical and Materials Engineering',
    'Other',
];
const degrees = ['B.Tech', 'M.Tech', 'MSc', 'MCA', 'PhD', 'Dual Degree', 'Integrated MSc'];

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({});

    useEffect(() => {
        api.get('/student/profile')
            .then(res => {
                setProfile(res.data);
                setForm(res.data.studentProfile || {});
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        if (form.cgpa && (form.cgpa < 0 || form.cgpa > 10)) {
            toast.error('CGPA must be between 0 and 10.');
            return;
        }
        setSaving(true);
        try {
            const res = await api.put('/student/profile', form);
            setProfile(res.data);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('resume', file);
        try {
            const res = await api.post('/student/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Resume uploaded!');
            setForm({ ...form, resumeUrl: res.data.resumeUrl });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        }
    };

    if (loading) return <LoadingSkeleton />;

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div>
            <div className="page-header">
                <h1>My Profile</h1>
                <p>Manage your placement profile and resume</p>
            </div>

            <form onSubmit={handleSave}>
                <div className={styles.profileSection}>
                    <h2>Personal Information</h2>
                    <div className={styles.profileGrid}>
                        <div className="form-group">
                            <label>First Name</label>
                            <input value={form.firstName || ''} onChange={set('firstName')} placeholder="First Name" />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input value={form.lastName || ''} onChange={set('lastName')} placeholder="Last Name" />
                        </div>
                        <div className="form-group">
                            <label>Roll Number</label>
                            <input value={form.rollNumber || ''} onChange={set('rollNumber')} placeholder="e.g. 21CSE001" />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input value={form.phone || ''} onChange={set('phone')} placeholder="+91-XXXXXXXXXX" />
                        </div>
                        <div className="form-group">
                            <label>Gender</label>
                            <select value={form.gender || ''} onChange={set('gender')}>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input type="date" value={form.dateOfBirth ? form.dateOfBirth.split('T')[0] : ''} onChange={set('dateOfBirth')} />
                        </div>
                    </div>
                </div>

                <div className={styles.profileSection}>
                    <h2>Academic Information</h2>
                    <div className={styles.profileGrid}>
                        <div className="form-group">
                            <label>Branch</label>
                            <select value={form.branch || ''} onChange={set('branch')}>
                                <option value="">Select Branch</option>
                                {branches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Degree</label>
                            <select value={form.degree || ''} onChange={set('degree')}>
                                <option value="">Select Degree</option>
                                {degrees.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>CGPA (0-10)</label>
                            <input type="number" step="0.01" min="0" max="10" value={form.cgpa || ''} onChange={set('cgpa')} />
                        </div>
                        <div className="form-group">
                            <label>Active Backlogs</label>
                            <input type="number" min="0" value={form.activeBacklogs || 0} onChange={set('activeBacklogs')} />
                        </div>
                        <div className="form-group">
                            <label>10th Percentage</label>
                            <input type="number" step="0.1" value={form.tenthPercentage || ''} onChange={set('tenthPercentage')} />
                        </div>
                        <div className="form-group">
                            <label>12th Percentage</label>
                            <input type="number" step="0.1" value={form.twelfthPercentage || ''} onChange={set('twelfthPercentage')} />
                        </div>
                        <div className="form-group">
                            <label>Passing Year</label>
                            <input type="number" value={form.passingYear || ''} onChange={set('passingYear')} placeholder="e.g. 2025" />
                        </div>
                    </div>
                </div>

                <div className={styles.profileSection}>
                    <h2>Resume</h2>
                    {form.resumeUrl && (
                        <p style={{ marginBottom: 12 }}>
                            Current: <a href={`${SERVER_URL}${form.resumeUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                                View Resume ↗
                            </a>
                        </p>
                    )}
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                    <small style={{ display: 'block', marginTop: 4, color: 'var(--text-light)' }}>PDF, DOC, DOCX (max 5MB)</small>
                </div>

                <div className={styles.profileSection}>
                    <h2>Skills</h2>
                    <div className="form-group">
                        <label>Skills (comma-separated)</label>
                        <input
                            value={Array.isArray(form.skills) ? form.skills.join(', ') : form.skills || ''}
                            onChange={(e) => setForm({ ...form, skills: e.target.value.split(',').map(s => s.trim()) })}
                            placeholder="React, Node.js, Python, Machine Learning"
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

export default Profile;
