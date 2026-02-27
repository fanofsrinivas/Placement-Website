import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import nitwLogo from '../../assets/nitw-logo.png'
import { useAuth } from '../../context/AuthContext'
import RegistrationProgress from '../../components/auth/RegistrationProgress'
import BasicInfoForm from '../../components/auth/BasicInfoForm'
import AcademicsForm from '../../components/auth/AcademicsForm'
import CredentialsForm from '../../components/auth/CredentialsForm'
import OTPVerification from '../../components/auth/OTPVerification'
import RegistrationSuccess from '../../components/auth/RegistrationSuccess'

const STEPS = ['Basic Info', 'Academics', 'Credentials']

export default function StudentRegister() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        basic: {}, academics: {}, credentials: {}
    })
    const [regError, setRegError] = useState('')
    const [regLoading, setRegLoading] = useState(false)
    const { registerStudent } = useAuth()
    const navigate = useNavigate()

    const updateData = (section) => (data) => {
        setFormData(prev => ({ ...prev, [section]: data }))
    }

    const handleFinalSubmit = async () => {
        setRegError('')
        setRegLoading(true)
        try {
            const payload = {
                name: formData.basic.name,
                rollNumber: formData.basic.rollNumber,
                email: formData.basic.email,
                mobile: formData.basic.mobile,
                dob: formData.basic.dob,
                degree: formData.academics.degree,
                branch: formData.academics.branch,
                password: formData.credentials.password,
            }
            await registerStudent(payload)
            setStep(5)
            // After 2 seconds, redirect to dashboard
            setTimeout(() => navigate('/student-dashboard'), 2000)
        } catch (err) {
            setRegError(err.response?.data?.message || 'Registration failed. Please try again.')
            setStep(3) // Go back to credentials step to show error
        } finally {
            setRegLoading(false)
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <BasicInfoForm
                        data={formData.basic}
                        onChange={updateData('basic')}
                        onNext={() => setStep(2)}
                    />
                )
            case 2:
                return (
                    <AcademicsForm
                        data={formData.academics}
                        onChange={updateData('academics')}
                        onNext={() => setStep(3)}
                        onBack={() => setStep(1)}
                    />
                )
            case 3:
                return (
                    <CredentialsForm
                        data={formData.credentials}
                        onChange={updateData('credentials')}
                        onNext={() => setStep(4)}
                        onBack={() => setStep(2)}
                    />
                )
            case 4:
                return (
                    <OTPVerification
                        email={formData.basic.email}
                        onVerify={handleFinalSubmit}
                        onBack={() => setStep(3)}
                    />
                )
            case 5:
                return (
                    <RegistrationSuccess
                        message="Registration Successful!"
                        submessage="Redirecting to your dashboard..."
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card auth-card--wide">
                {step <= 3 && (
                    <>
                        <img src={nitwLogo} alt="NIT Warangal" className="auth-logo" />
                        <h1>Student Registration</h1>
                        <p className="subtitle">Step {step} of 3 — {STEPS[step - 1]}</p>
                        <RegistrationProgress currentStep={step} steps={STEPS} />
                    </>
                )}

                {regError && step <= 4 && (
                    <div className="alert alert--error" style={{ marginBottom: 16 }}>
                        <span>{regError}</span>
                    </div>
                )}

                {regLoading && step === 4 && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.7)' }}>
                        Creating your account...
                    </div>
                )}

                {!regLoading && renderStep()}

                {step <= 3 && (
                    <div className="auth-links">
                        Already have an account? <Link to="/">Sign In</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
