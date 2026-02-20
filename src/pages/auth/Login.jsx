import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
    const [active, setActive] = useState(false)

    const handleSignIn = (e) => {
        e.preventDefault()
        console.log('Sign In submitted')
    }

    return (
        <div className="auth-page">
            <div className={`login-container${active ? ' active' : ''}`}>

                {/* Forms */}
                <div className="login-forms-wrap">

                    {/* Sign In */}
                    <div className="login-form-panel login-sign-in">
                        <h1>Sign In</h1>
                        <p className="subtitle">Welcome back to the Placement Portal</p>
                        <form onSubmit={handleSignIn}>
                            <div className="login-input-group">
                                <input type="email" id="loginEmail" placeholder=" " required />
                                <label htmlFor="loginEmail">Email</label>
                            </div>
                            <div className="login-input-group">
                                <input type="password" id="loginPassword" placeholder=" " required />
                                <label htmlFor="loginPassword">Password</label>
                            </div>
                            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                            <button type="submit" className="btn btn-primary">Sign In</button>
                        </form>
                    </div>

                    {/* Register Choice Panel */}
                    <div className="login-form-panel login-sign-up">
                        <h1>Join Us</h1>
                        <p className="subtitle">Choose your registration type to get started</p>

                        <Link to="/student-register" className="btn btn-primary" style={{ marginBottom: 14, textDecoration: 'none' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            Student Registration
                        </Link>

                        <Link to="/company-register" className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
                            </svg>
                            Company Registration
                        </Link>
                    </div>
                </div>

                {/* Overlay */}
                <div className="login-overlay-wrap">
                    <div className="login-overlay">
                        <div className="login-overlay-panel login-overlay-right">
                            <h2>Hello, Friend!</h2>
                            <p>Register now and start your placement journey</p>
                            <button className="btn btn-ghost" onClick={() => setActive(true)}>Sign Up</button>
                        </div>
                        <div className="login-overlay-panel login-overlay-left">
                            <h2>Welcome Back!</h2>
                            <p>Already have an account?</p>
                            <button className="btn btn-ghost" onClick={() => setActive(false)}>Sign In</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
