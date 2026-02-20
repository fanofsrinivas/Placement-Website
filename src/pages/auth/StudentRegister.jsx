import { useState } from 'react'
import { Link } from 'react-router-dom'
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

    const updateData = (section) => (data) => {
        setFormData(prev => ({ ...prev, [section]: data }))
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
                        onVerify={() => setStep(5)}
                        onBack={() => setStep(3)}
                    />
                )
            case 5:
                return (
                    <RegistrationSuccess
                        message="Registration Successful!"
                        submessage="Please wait for verification by the admin team."
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
                        <h1>Student Registration</h1>
                        <p className="subtitle">Step {step} of 3 — {STEPS[step - 1]}</p>
                        <RegistrationProgress currentStep={step} steps={STEPS} />
                    </>
                )}

                {renderStep()}

                {step <= 3 && (
                    <div className="auth-links">
                        Already have an account? <Link to="/">Sign In</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
