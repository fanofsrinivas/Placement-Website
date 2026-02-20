import { useState } from 'react'

const EXISTING_ROLLS = ['ROLL001', 'CS2021001', 'EC2021002']

export default function BasicInfoForm({ data, onChange, onNext }) {
    const [errors, setErrors] = useState({})
    const [checkingRoll, setCheckingRoll] = useState(false)

    const validate = async () => {
        const errs = {}
        if (!data.name?.trim()) errs.name = 'Name is required'
        if (!data.rollNumber?.trim()) errs.rollNumber = 'Roll number is required'
        if (!data.email?.trim()) errs.email = 'Email is required'
        else if (!/^[0-9]{2}[a-z]{3}[0-9][a-z][0-9]{2}@student\.nitw\.ac\.in$/i.test(data.email))
            errs.email = 'Use your institute email (e.g. 24mab0a17@student.nitw.ac.in)'
        if (!data.mobile?.trim()) errs.mobile = 'Mobile number is required'
        else if (!/^\d{10}$/.test(data.mobile)) errs.mobile = 'Enter a valid 10-digit number'
        if (!data.dob) errs.dob = 'Date of birth is required'

        // Roll number uniqueness check
        if (data.rollNumber?.trim() && !errs.rollNumber) {
            setCheckingRoll(true)
            await new Promise(r => setTimeout(r, 600)) // simulate API call
            if (EXISTING_ROLLS.includes(data.rollNumber.trim().toUpperCase())) {
                errs.rollNumber = 'This roll number is already registered'
            }
            setCheckingRoll(false)
        }

        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (await validate()) onNext()
    }

    const handleChange = (field) => (e) => {
        onChange({ ...data, [field]: e.target.value })
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    return (
        <form onSubmit={handleSubmit} className="animate-fade-up">
            <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                    id="name" type="text" placeholder="Enter your full name"
                    value={data.name || ''} onChange={handleChange('name')}
                    className={errors.name ? 'error' : ''}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="rollNumber">Roll Number</label>
                    <input
                        id="rollNumber" type="text" placeholder="e.g. CS2023001"
                        value={data.rollNumber || ''} onChange={handleChange('rollNumber')}
                        className={errors.rollNumber ? 'error' : ''}
                    />
                    {errors.rollNumber && <p className="error-text">{errors.rollNumber}</p>}
                    {checkingRoll && <p className="helper-text">Checking availability…</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                        id="dob" type="date"
                        value={data.dob || ''} onChange={handleChange('dob')}
                        className={errors.dob ? 'error' : ''}
                    />
                    {errors.dob && <p className="error-text">{errors.dob}</p>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    id="email" type="email" placeholder="24mab0a17@student.nitw.ac.in"
                    value={data.email || ''} onChange={handleChange('email')}
                    className={errors.email ? 'error' : ''}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                    id="mobile" type="tel" placeholder="10-digit mobile number"
                    value={data.mobile || ''} onChange={handleChange('mobile')}
                    className={errors.mobile ? 'error' : ''}
                />
                {errors.mobile && <p className="error-text">{errors.mobile}</p>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={checkingRoll}>
                {checkingRoll ? 'Verifying…' : 'Next Step →'}
            </button>
        </form>
    )
}
