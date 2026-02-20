import { Link } from 'react-router-dom'

export default function RegistrationSuccess({ message, submessage }) {
    return (
        <div className="success-state animate-fade-up">
            <div className="success-state__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
            <h2>{message || 'Registration Successful!'}</h2>
            <p>{submessage || 'Please wait for verification by the admin team.'}</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                You'll receive a confirmation email once your account is verified.
            </p>
            <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: 24 }}>
                Back to Login
            </Link>
        </div>
    )
}
