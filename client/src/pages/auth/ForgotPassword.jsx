import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../context/AuthContext';
import styles from '../public/Public.module.css';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
    const [form, setForm] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email: form.email });
            toast.success('OTP sent to your email!');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndReset = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        if (form.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                email: form.email,
                otp: form.otp,
                newPassword: form.newPassword,
            });
            toast.success('Password reset successfully! You can now login.');
            setStep(3);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <h1>Reset Password</h1>
                <p className={styles.subtitle}>
                    {step === 1 && 'Enter your email to receive an OTP'}
                    {step === 2 && 'Enter the OTP and your new password'}
                    {step === 3 && 'Password reset complete!'}
                </p>

                {step === 1 && (
                    <form onSubmit={handleSendOTP}>
                        <div className="form-group">
                            <label htmlFor="forgot-email">Email Address</label>
                            <input id="forgot-email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyAndReset}>
                        <div className="form-group">
                            <label htmlFor="forgot-otp">OTP Code</label>
                            <input id="forgot-otp" required value={form.otp} onChange={e => setForm({ ...form, otp: e.target.value })} placeholder="Enter 6-digit OTP" maxLength={6} style={{ fontSize: 24, letterSpacing: 8, textAlign: 'center' }} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="forgot-newpwd">New Password</label>
                            <input id="forgot-newpwd" type="password" required value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} placeholder="Min 8 characters" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="forgot-confirmpwd">Confirm Password</label>
                            <input id="forgot-confirmpwd" type="password" required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter password" />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                        <p>Your password has been reset successfully.</p>
                        <Link to="/login" className="btn btn-primary" style={{ marginTop: 16 }}>
                            Go to Login
                        </Link>
                    </div>
                )}

                <div className={styles.authLinks}>
                    <Link to="/login">← Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
