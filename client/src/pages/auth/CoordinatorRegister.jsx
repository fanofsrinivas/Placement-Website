import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import styles from '../public/Public.module.css';

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

const CoordinatorRegister = () => {
    const [form, setForm] = useState({
        email: '', password: '', confirmPassword: '',
        firstName: '', lastName: '', rollNumber: '',
        branch: '', degree: '', cgpa: '', departments: [],
    });
    const [loading, setLoading] = useState(false);
    const { registerCoordinator } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        if (!/@(student\.)?nitw\.ac\.in$/i.test(form.email)) {
            toast.error('Only official NIT Warangal email IDs (@nitw.ac.in) are allowed.');
            return false;
        }
        if (form.password.length < 8) {
            toast.error('Password must be at least 8 characters.');
            return false;
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match.');
            return false;
        }
        if (form.cgpa && (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 10)) {
            toast.error('CGPA must be between 0 and 10.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await registerCoordinator({
                ...form,
                cgpa: form.cgpa ? parseFloat(form.cgpa) : undefined,
                departments: form.departments,
            });
            toast.success('Registration successful! Please verify your email & await admin approval.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard} style={{ maxWidth: 520 }}>
                <h1>Coordinator Registration</h1>
                <p className={styles.subtitle}>Register as a Student Coordinator for placement drives</p>
                <div style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    padding: '10px 14px',
                    borderRadius: 8,
                    marginBottom: 20,
                    fontSize: 13,
                    color: '#92400e',
                    fontWeight: 500,
                }}>
                    ⚡ Coordinator accounts require admin approval after registration.
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label htmlFor="coord-firstname">First Name *</label>
                            <input id="coord-firstname" required value={form.firstName} onChange={set('firstName')} placeholder="First Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="coord-lastname">Last Name *</label>
                            <input id="coord-lastname" required value={form.lastName} onChange={set('lastName')} placeholder="Last Name" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="coord-email">NITW Email *</label>
                        <input id="coord-email" type="email" required value={form.email} onChange={set('email')} placeholder="yourname@nitw.ac.in" />
                        <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                            Only @nitw.ac.in or @student.nitw.ac.in emails accepted
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="coord-roll">Roll Number *</label>
                        <input id="coord-roll" required value={form.rollNumber} onChange={set('rollNumber')} placeholder="e.g. 21CSE001" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label htmlFor="coord-branch">Branch *</label>
                            <select id="coord-branch" required value={form.branch} onChange={set('branch')}>
                                <option value="">Select Branch</option>
                                {branches.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="coord-degree">Degree *</label>
                            <select id="coord-degree" required value={form.degree} onChange={set('degree')}>
                                <option value="">Select Degree</option>
                                {degrees.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="coord-cgpa">Current CGPA (0-10)</label>
                        <input id="coord-cgpa" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={set('cgpa')} placeholder="e.g. 8.5" />
                    </div>

                    <div className="form-group">
                        <label>
                            Departments to Coordinate *
                            <button type="button" onClick={() => {
                                const allSelected = form.departments.length === branches.length;
                                setForm({ ...form, departments: allSelected ? [] : [...branches] });
                            }} style={{
                                marginLeft: 12, background: 'none', border: '1px solid var(--primary)',
                                color: 'var(--primary)', borderRadius: 4, padding: '2px 8px', fontSize: 12, cursor: 'pointer',
                            }}>
                                {form.departments.length === branches.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </label>
                        <small style={{ color: 'var(--text-light)', fontSize: '12px', display: 'block', marginBottom: 6 }}>
                            Select the departments/branches you will coordinate for
                        </small>
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                            gap: 6, maxHeight: 180, overflowY: 'auto', padding: 8,
                            border: '1px solid var(--border)', borderRadius: 8, background: '#f8fafc',
                        }}>
                            {branches.map(b => (
                                <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                                    <input type="checkbox" checked={form.departments.includes(b)}
                                        onChange={() => {
                                            const updated = form.departments.includes(b)
                                                ? form.departments.filter(d => d !== b)
                                                : [...form.departments, b];
                                            setForm({ ...form, departments: updated });
                                        }}
                                    />
                                    {b}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="coord-password">Password *</label>
                        <input id="coord-password" type="password" required value={form.password} onChange={set('password')} placeholder="Min 8 characters" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="coord-confirm">Confirm Password *</label>
                        <input id="coord-confirm" type="password" required value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Re-enter password" />
                        {form.confirmPassword && form.password !== form.confirmPassword && (
                            <div className="error">Passwords do not match</div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Registering...' : 'Register as Coordinator'}
                    </button>
                </form>

                <div className={styles.authLinks}>
                    <p>Already registered? <Link to="/login">Sign In</Link></p>
                    <p>Register as: <Link to="/register/student">Student</Link> | <Link to="/register/company">Company</Link></p>
                </div>
            </div>
        </div>
    );
};

export default CoordinatorRegister;
