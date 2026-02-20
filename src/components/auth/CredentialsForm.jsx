import { useState } from 'react'
import PasswordStrength from './PasswordStrength'

export default function CredentialsForm({ data, onChange, onNext, onBack }) {
    const [errors, setErrors] = useState({})

    const validate = () => {
        const errs = {}
        if (!data.password) errs.password = 'Password is required'
        else if (data.password.length < 8) errs.password = 'Min 8 characters required'
        if (!data.confirmPassword) errs.confirmPassword = 'Please confirm your password'
        else if (data.password !== data.confirmPassword) errs.confirmPassword = 'Passwords do not match'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) onNext()
    }

    const handleChange = (field) => (e) => {
        onChange({ ...data, [field]: e.target.value })
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    return (
        <form onSubmit={handleSubmit} className="animate-fade-up">
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password" type="password" placeholder="Min 8 characters"
                    value={data.password || ''} onChange={handleChange('password')}
                    className={errors.password ? 'error' : ''}
                />
                {errors.password && <p className="error-text">{errors.password}</p>}
                <PasswordStrength password={data.password || ''} />
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword" type="password" placeholder="Re-enter password"
                    value={data.confirmPassword || ''} onChange={handleChange('confirmPassword')}
                    className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>

            <div className="btn-row">
                <button type="button" className="btn btn-secondary" onClick={onBack}>← Back</button>
                <button type="submit" className="btn btn-primary">Create Account</button>
            </div>
        </form>
    )
}
