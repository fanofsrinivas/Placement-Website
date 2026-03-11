import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import styles from '../public/Public.module.css';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '', role: 'student' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(form.email, form.password, form.role);
            toast.success('Login successful!');
            const redirects = { student: '/student/dashboard', company: '/company/dashboard', admin: '/admin/dashboard', tpo: '/tpo/dashboard' };
            navigate(redirects[data.user.role] || '/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <h1>Welcome Back</h1>
                <p className={styles.subtitle}>Sign in to your NITW Placement Portal</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="login-role">Login As</label>
                        <select id="login-role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                            <option value="student">Student</option>
                            <option value="company">Company</option>
                            <option value="admin">Admin</option>
                            <option value="tpo">TPO</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-email">Email</label>
                        <input
                            id="login-email" type="email" required
                            placeholder={form.role === 'student' ? 'yourname@nitw.ac.in' : 'email@company.com'}
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                        {form.role === 'student' && (
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.authLinks}>
                    <p>Don't have an account?{' '}
                        <Link to="/register/student">Student Register</Link> |{' '}
                        <Link to="/register/company">Company Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
