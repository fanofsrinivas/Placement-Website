import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import styles from '../public/Public.module.css';

const departments = [
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

const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'HoD', 'Other'];

const FacultyRegister = () => {
    const [form, setForm] = useState({
        email: '', password: '', confirmPassword: '',
        firstName: '', lastName: '', employeeId: '',
        designation: '', phone: '', departments: [],
    });
    const [loading, setLoading] = useState(false);
    const { registerFaculty } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        if (!/@nitw\.ac\.in$/i.test(form.email)) {
            toast.error('Only official NIT Warangal email IDs (@nitw.ac.in) are allowed for faculty.');
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
        if (!form.designation) {
            toast.error('Please select your designation.');
            return false;
        }
        if (form.departments.length === 0) {
            toast.error('Please select at least one department to coordinate.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await registerFaculty({
                email: form.email,
                password: form.password,
                firstName: form.firstName,
                lastName: form.lastName,
                employeeId: form.employeeId,
                designation: form.designation,
                phone: form.phone,
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
                <h1>Faculty Registration</h1>
                <p className={styles.subtitle}>Register as a Faculty Department Coordinator</p>
                <div style={{
                    background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                    padding: '10px 14px',
                    borderRadius: 8,
                    marginBottom: 20,
                    fontSize: 13,
                    color: '#1e40af',
                    fontWeight: 500,
                }}>
                    🎓 Faculty accounts require admin approval after registration.
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label htmlFor="fac-firstname">First Name *</label>
                            <input id="fac-firstname" required value={form.firstName} onChange={set('firstName')} placeholder="First Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fac-lastname">Last Name *</label>
                            <input id="fac-lastname" required value={form.lastName} onChange={set('lastName')} placeholder="Last Name" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fac-email">NITW Email *</label>
                        <input id="fac-email" type="email" required value={form.email} onChange={set('email')} placeholder="yourname@nitw.ac.in" />
                        <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                            Only @nitw.ac.in emails accepted (faculty emails)
                        </small>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label htmlFor="fac-empid">Employee ID *</label>
                            <input id="fac-empid" required value={form.employeeId} onChange={set('employeeId')} placeholder="e.g. FAC001" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fac-designation">Designation *</label>
                            <select id="fac-designation" required value={form.designation} onChange={set('designation')}>
                                <option value="">Select Designation</option>
                                {designations.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fac-phone">Phone Number</label>
                        <input id="fac-phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="e.g. 9876543210" />
                    </div>

                    <div className="form-group">
                        <label>
                            Departments to Coordinate *
                            <button type="button" onClick={() => {
                                const allSelected = form.departments.length === departments.length;
                                setForm({ ...form, departments: allSelected ? [] : [...departments] });
                            }} style={{
                                marginLeft: 12, background: 'none', border: '1px solid var(--primary)',
                                color: 'var(--primary)', borderRadius: 4, padding: '2px 8px', fontSize: 12, cursor: 'pointer',
                            }}>
                                {form.departments.length === departments.length ? 'Deselect All' : 'Select All'}
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
                            {departments.map(b => (
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
                        <label htmlFor="fac-password">Password *</label>
                        <input id="fac-password" type="password" required value={form.password} onChange={set('password')} placeholder="Min 8 characters" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fac-confirm">Confirm Password *</label>
                        <input id="fac-confirm" type="password" required value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Re-enter password" />
                        {form.confirmPassword && form.password !== form.confirmPassword && (
                            <div className="error">Passwords do not match</div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Registering...' : 'Register as Faculty'}
                    </button>
                </form>

                <div className={styles.authLinks}>
                    <p>Already registered? <Link to="/login">Sign In</Link></p>
                    <p>Register as: <Link to="/register/student">Student</Link> | <Link to="/register/coordinator">Coordinator</Link> | <Link to="/register/company">Company</Link></p>
                </div>
            </div>
        </div>
    );
};

export default FacultyRegister;
