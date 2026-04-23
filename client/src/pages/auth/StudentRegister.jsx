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

const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = ['', 'weak', 'fair', 'good', 'strong'];

const StudentRegister = () => {
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [form, setForm] = useState({
        email: '', password: '', confirmPassword: '',
        firstName: '', lastName: '', rollNumber: '',
        branch: '', degree: '', cgpa: '',
    });
    const [loading, setLoading] = useState(false);
    const { registerStudent, verifyEmailOTP, resendEmailOTP } = useAuth();
    const navigate = useNavigate();

    const strength = getPasswordStrength(form.password);

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
            await registerStudent({
                ...form,
                cgpa: form.cgpa ? parseFloat(form.cgpa) : undefined,
            });
            toast.success('Registration successful! Please verify your email.');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyEmailOTP(form.email, otp);
            toast.success('Email verified successfully!');
            navigate('/student/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            await resendEmailOTP(form.email);
            toast.success('OTP resent to your email.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend OTP');
        }
    };

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard} style={{ maxWidth: 520 }}>
                <h1>Student Registration</h1>
                <p className={styles.subtitle}>Create your NITW placement account</p>

                {step === 1 ? (
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label htmlFor="reg-firstname">First Name *</label>
                                <input id="reg-firstname" required value={form.firstName} onChange={set('firstName')} placeholder="First Name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-lastname">Last Name *</label>
                                <input id="reg-lastname" required value={form.lastName} onChange={set('lastName')} placeholder="Last Name" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-email">NITW Email *</label>
                            <input id="reg-email" type="email" required value={form.email} onChange={set('email')} placeholder="yourname@nitw.ac.in" />
                            <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                                Only @nitw.ac.in or @student.nitw.ac.in emails accepted
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-roll">Roll Number *</label>
                            <input id="reg-roll" required value={form.rollNumber} onChange={set('rollNumber')} placeholder="e.g. 21CSE001" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label htmlFor="reg-branch">Branch *</label>
                                <select id="reg-branch" required value={form.branch} onChange={set('branch')}>
                                    <option value="">Select Branch</option>
                                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-degree">Degree *</label>
                                <select id="reg-degree" required value={form.degree} onChange={set('degree')}>
                                    <option value="">Select Degree</option>
                                    {degrees.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-cgpa">Current CGPA (0-10)</label>
                            <input id="reg-cgpa" type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={set('cgpa')} placeholder="e.g. 8.5" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-password">Password *</label>
                            <input id="reg-password" type="password" required value={form.password} onChange={set('password')} placeholder="Min 8 characters" />
                            <div className={styles.strengthBar}>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`${styles.strengthSegment} ${strength >= i ? styles[strengthColors[i]] : ''}`} />
                                ))}
                            </div>
                            {form.password && (
                                <div className={styles.strengthLabel} style={{ color: strength <= 1 ? 'var(--error)' : strength <= 2 ? 'var(--warning)' : 'var(--success)' }}>
                                    {strengthLabels[strength]}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-confirm">Confirm Password *</label>
                            <input id="reg-confirm" type="password" required value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Re-enter password" />
                            {form.confirmPassword && form.password !== form.confirmPassword && (
                                <div className="error">Passwords do not match</div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Registering...' : 'Create Account'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOTPSubmit}>
                        <div style={{
                            background: 'var(--bg-secondary, #f0f4ff)', borderRadius: 10,
                            padding: '18px 16px', marginBottom: 20, textAlign: 'center',
                        }}>
                            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-light)' }}>
                                Verification OTP sent to
                            </p>
                            <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 15, color: 'var(--primary)' }}>
                                {form.email}
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-otp">Enter OTP</label>
                            <input
                                id="reg-otp" type="text" required maxLength={6} placeholder="Enter 6-digit OTP"
                                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                style={{ letterSpacing: '6px', textAlign: 'center', fontSize: 22, fontWeight: 700 }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Continue'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <button type="button" onClick={handleResendOTP} style={{
                                background: 'none', border: 'none', color: 'var(--primary)',
                                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                            }}>
                                Resend OTP
                            </button>
                        </div>
                    </form>
                )}

                <div className={styles.authLinks}>
                    <p>Already registered? <Link to="/login">Sign In</Link></p>
                    <p>Are you a company? <Link to="/register/company">Register as Company</Link></p>
                </div>
            </div>
        </div>
    );
};

export default StudentRegister;
