import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import nitwLogo from '../../assets/nitw-logo.png'
import { useAuth } from '../../context/AuthContext'
import PasswordStrength from '../../components/auth/PasswordStrength'
import RegistrationSuccess from '../../components/auth/RegistrationSuccess'

export default function CompanyRegister() {
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState({})
    const [apiError, setApiError] = useState('')
    const [loading, setLoading] = useState(false)
    const { registerCompany } = useAuth()
    const navigate = useNavigate()
    const [data, setData] = useState({
        companyName: '', website: '', linkedin: '',
        hrName: '', hrEmail: '', hrPhone: '',
        street: '', city: '', state: '', country: '',
        email: '', password: '', confirmPassword: ''
    })

    const handleChange = (field) => (e) => {
        setData(prev => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
        if (apiError) setApiError('')
    }

    const validate = () => {
        const errs = {}
        if (!data.companyName.trim()) errs.companyName = 'Company name is required'
        if (!data.website.trim()) errs.website = 'Website is required'
        else if (!/^https?:\/\/.+\..+/.test(data.website)) errs.website = 'Enter a valid URL (https://...)'
        if (!data.linkedin.trim()) errs.linkedin = 'LinkedIn profile is required'
        else if (!data.linkedin.includes('linkedin.com')) errs.linkedin = 'Must be a LinkedIn URL'
        if (!data.hrName.trim()) errs.hrName = 'HR name is required'
        if (!data.hrEmail.trim()) errs.hrEmail = 'HR email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.hrEmail)) errs.hrEmail = 'Invalid email format'
        if (!data.hrPhone.trim()) errs.hrPhone = 'Phone is required'
        if (!data.city.trim()) errs.city = 'City is required'
        if (!data.country.trim()) errs.country = 'Country is required'
        if (!data.email.trim()) errs.email = 'Login email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.email = 'Invalid email format'
        if (!data.password) errs.password = 'Password is required'
        else if (data.password.length < 8) errs.password = 'Min 8 characters'
        if (data.password !== data.confirmPassword) errs.confirmPassword = 'Passwords do not match'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return

        setLoading(true)
        setApiError('')
        try {
            const { confirmPassword, ...payload } = data
            await registerCompany(payload)
            setSubmitted(true)
            // After 2 seconds, redirect to dashboard
            setTimeout(() => navigate('/company-dashboard'), 2000)
        } catch (err) {
            setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <RegistrationSuccess
                        message="Registration Successful!"
                        submessage="Redirecting to your dashboard..."
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="auth-page">
            <div className="auth-card auth-card--wide" style={{ maxWidth: 680 }}>
                <img src={nitwLogo} alt="NIT Warangal" className="auth-logo" />
                <h1>Company Registration</h1>
                <p className="subtitle">Register as a corporate placement partner</p>

                <div className="alert alert--info">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                    </svg>
                    <span>Admin approval is required after registration. You will be notified via email once your account is verified.</span>
                </div>

                {apiError && (
                    <div className="alert alert--error" style={{ marginBottom: 16 }}>
                        <span>{apiError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Company Info */}
                    <div className="form-section">
                        <div className="form-section__title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
                            </svg>
                            Company Information
                        </div>
                        <div className="form-group">
                            <label htmlFor="companyName">Company Name</label>
                            <input id="companyName" type="text" placeholder="Acme Inc." value={data.companyName} onChange={handleChange('companyName')} className={errors.companyName ? 'error' : ''} />
                            {errors.companyName && <p className="error-text">{errors.companyName}</p>}
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="website">Website</label>
                                <input id="website" type="url" placeholder="https://example.com" value={data.website} onChange={handleChange('website')} className={errors.website ? 'error' : ''} />
                                {errors.website && <p className="error-text">{errors.website}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="linkedin">LinkedIn Profile</label>
                                <input id="linkedin" type="url" placeholder="https://linkedin.com/company/..." value={data.linkedin} onChange={handleChange('linkedin')} className={errors.linkedin ? 'error' : ''} />
                                {errors.linkedin && <p className="error-text">{errors.linkedin}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="form-section">
                        <div className="form-section__title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            Contact Information
                        </div>
                        <div className="form-group">
                            <label htmlFor="hrName">HR Contact Name</label>
                            <input id="hrName" type="text" placeholder="Full name" value={data.hrName} onChange={handleChange('hrName')} className={errors.hrName ? 'error' : ''} />
                            {errors.hrName && <p className="error-text">{errors.hrName}</p>}
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="hrEmail">HR Email</label>
                                <input id="hrEmail" type="email" placeholder="hr@company.com" value={data.hrEmail} onChange={handleChange('hrEmail')} className={errors.hrEmail ? 'error' : ''} />
                                {errors.hrEmail && <p className="error-text">{errors.hrEmail}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="hrPhone">HR Phone</label>
                                <input id="hrPhone" type="tel" placeholder="+91 98765 43210" value={data.hrPhone} onChange={handleChange('hrPhone')} className={errors.hrPhone ? 'error' : ''} />
                                {errors.hrPhone && <p className="error-text">{errors.hrPhone}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="form-section">
                        <div className="form-section__title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            Address
                        </div>
                        <div className="form-group">
                            <label htmlFor="street">Street Address</label>
                            <input id="street" type="text" placeholder="123 Main St" value={data.street} onChange={handleChange('street')} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input id="city" type="text" placeholder="City" value={data.city} onChange={handleChange('city')} className={errors.city ? 'error' : ''} />
                                {errors.city && <p className="error-text">{errors.city}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="state">State</label>
                                <input id="state" type="text" placeholder="State" value={data.state} onChange={handleChange('state')} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country</label>
                            <input id="country" type="text" placeholder="Country" value={data.country} onChange={handleChange('country')} className={errors.country ? 'error' : ''} />
                            {errors.country && <p className="error-text">{errors.country}</p>}
                        </div>
                    </div>

                    {/* Credentials */}
                    <div className="form-section">
                        <div className="form-section__title">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Login Credentials
                        </div>
                        <div className="form-group">
                            <label htmlFor="loginEmail">Login Email</label>
                            <input id="loginEmail" type="email" placeholder="company@example.com" value={data.email} onChange={handleChange('email')} className={errors.email ? 'error' : ''} />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="loginPassword">Password</label>
                                <input id="loginPassword" type="password" placeholder="Min 8 characters" value={data.password} onChange={handleChange('password')} className={errors.password ? 'error' : ''} />
                                {errors.password && <p className="error-text">{errors.password}</p>}
                                <PasswordStrength password={data.password} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="loginConfirmPassword">Confirm Password</label>
                                <input id="loginConfirmPassword" type="password" placeholder="Re-enter password" value={data.confirmPassword} onChange={handleChange('confirmPassword')} className={errors.confirmPassword ? 'error' : ''} />
                                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Submitting…' : 'Submit Registration'}
                    </button>
                </form>

                <div className="auth-links">
                    Already have an account? <Link to="/">Sign In</Link>
                </div>
            </div>
        </div>
    )
}
