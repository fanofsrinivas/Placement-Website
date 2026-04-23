import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import styles from '../public/Public.module.css';

const Login = () => {
    const [step, setStep] = useState(1); // 1 = password, 2 = OTP
    const [form, setForm] = useState({ email: '', password: '', role: 'student' });
    const [otp, setOtp] = useState('');
    const [otpEmail, setOtpEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, verifyLoginOTP, resendLoginOTP } = useAuth();
    const navigate = useNavigate();

    const redirects = {
        student: '/student/dashboard',
        company: '/company/dashboard',
        admin: '/admin/dashboard',
        tpo: '/tpo/dashboard',
        coordinator: '/coordinator/dashboard',
        faculty: '/faculty/dashboard',
    };

    // Step 1: Submit password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(form.email, form.password, form.role);
            if (data.requireOTP) {
                setOtpEmail(data.email);
                setStep(2);
                toast.success('OTP sent to your email!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Submit OTP
    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await verifyLoginOTP(otpEmail, otp);
            toast.success('Login successful!');
            navigate(redirects[data.user.role] || '/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            await resendLoginOTP(otpEmail);
            toast.success('OTP resent successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend OTP');
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <h1>Welcome Back</h1>
                <p className={styles.subtitle}>Sign in to your NITW Placement Portal</p>

                {step === 1 ? (
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label htmlFor="login-role">Login As</label>
                            <select id="login-role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                <option value="student">Student</option>
                                <option value="coordinator">Student Coordinator</option>
                                <option value="faculty">Faculty (Dept. Coordinator)</option>
                                <option value="company">Company</option>
                                <option value="admin">Admin</option>
                                <option value="tpo">TPO</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-email">Email</label>
                            <input
                                id="login-email" type="email" required
                                placeholder={form.role === 'student' || form.role === 'coordinator' || form.role === 'faculty' ? 'yourname@nitw.ac.in' : 'email@company.com'}
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                            {(form.role === 'student' || form.role === 'coordinator' || form.role === 'faculty') && (
                                <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                                    Only @nitw.ac.in or @student.nitw.ac.in emails allowed
                                </small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-password">Password</label>
                            <input
                                id="login-password" type="password" required
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: 16 }}>
                            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 600 }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Verifying...' : 'Continue'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOTPSubmit}>
                        <div style={{
                            background: 'var(--bg-secondary, #f0f4ff)',
                            borderRadius: 10,
                            padding: '18px 16px',
                            marginBottom: 20,
                            textAlign: 'center',
                        }}>
                            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-light)' }}>
                                An OTP has been sent to
                            </p>
                            <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: 15, color: 'var(--primary)' }}>
                                {otpEmail}
                            </p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-otp">Enter OTP</label>
                            <input
                                id="login-otp"
                                type="text"
                                required
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                style={{ letterSpacing: '6px', textAlign: 'center', fontSize: 22, fontWeight: 700 }}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Verifying OTP...' : 'Verify & Sign In'}
                        </button>

                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <button type="button" onClick={handleResendOTP} style={{
                                background: 'none', border: 'none', color: 'var(--primary)',
                                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                            }}>
                                Resend OTP
                            </button>
                            <span style={{ margin: '0 8px', color: 'var(--text-light)' }}>|</span>
                            <button type="button" onClick={() => { setStep(1); setOtp(''); }} style={{
                                background: 'none', border: 'none', color: 'var(--text-light)',
                                cursor: 'pointer', fontSize: 13,
                            }}>
                                ← Back to Login
                            </button>
                        </div>
                    </form>
                )}

                <div className={styles.authLinks}>
                    <p>Don't have an account?{' '}
                        <Link to="/register/student">Student Register</Link> |{' '}
                        <Link to="/register/coordinator">Coordinator Register</Link> |{' '}
                        <Link to="/register/faculty">Faculty Register</Link> |{' '}
                        <Link to="/register/company">Company Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
