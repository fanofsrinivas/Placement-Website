import { useState } from 'react'
import { Link } from 'react-router-dom'
import OTPVerification from '../../components/auth/OTPVerification'
import PasswordStrength from '../../components/auth/PasswordStrength'

export default function ForgotPassword() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [sending, setSending] = useState(false)
    const [done, setDone] = useState(false)

    // Step 1: Email input
    const handleSendOTP = async (e) => {
        e.preventDefault()
        if (!email.trim()) { setEmailError('Email is required'); return }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Invalid email format'); return }
        setEmailError('')
        setSending(true)
        await new Promise(r => setTimeout(r, 800))
        setSending(false)
        setStep(2)
    }

    // Step 2 handled by OTPVerification component

    // Step 3: Reset password
    const handleReset = (e) => {
        e.preventDefault()
        const errs = {}
        if (!password) errs.password = 'Password is required'
        else if (password.length < 8) errs.password = 'Min 8 characters'
        if (!confirmPassword) errs.confirmPassword = 'Please confirm your password'
        else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match'
        setErrors(errs)
        if (Object.keys(errs).length === 0) {
            console.log('Password reset for', email)
            setDone(true)
        }
    }

    if (done) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <div className="success-state animate-fade-up">
                        <div className="success-state__icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2>Password Reset!</h2>
                        <p>Your password has been successfully updated. You can now sign in with your new password.</p>
                        <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: 24 }}>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                {step === 1 && (
                    <div className="animate-fade-up">
                        <h1>Forgot Password</h1>
                        <p className="subtitle">Enter your registered email to receive a verification code</p>

                        <form onSubmit={handleSendOTP}>
                            <div className="form-group">
                                <label htmlFor="resetEmail">Email Address</label>
                                <input
                                    id="resetEmail" type="email" placeholder="you@example.com"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setEmailError('') }}
                                    className={emailError ? 'error' : ''}
                                />
                                {emailError && <p className="error-text">{emailError}</p>}
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={sending}>
                                {sending ? 'Sending…' : 'Send OTP'}
                            </button>
                        </form>

                        <div className="auth-links">
                            Remember your password? <Link to="/">Sign In</Link>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <OTPVerification
                        email={email}
                        onVerify={() => setStep(3)}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && (
                    <div className="animate-fade-up">
                        <h1>Reset Password</h1>
                        <p className="subtitle">Create a new password for your account</p>

                        <form onSubmit={handleReset}>
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <input
                                    id="newPassword" type="password" placeholder="Min 8 characters"
                                    value={password}
                                    onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })) }}
                                    className={errors.password ? 'error' : ''}
                                />
                                {errors.password && <p className="error-text">{errors.password}</p>}
                                <PasswordStrength password={password} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                                <input
                                    id="confirmNewPassword" type="password" placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={e => { setConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, confirmPassword: undefined })) }}
                                    className={errors.confirmPassword ? 'error' : ''}
                                />
                                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                            </div>

                            <button type="submit" className="btn btn-primary">Reset Password</button>
                        </form>

                        <div className="auth-links" style={{ marginTop: 16 }}>
                            <Link to="/">← Back to Login</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
