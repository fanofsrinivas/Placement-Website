import { useState, useRef, useEffect } from 'react'

export default function OTPVerification({ email, onVerify, onBack }) {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [error, setError] = useState('')
    const [resendTimer, setResendTimer] = useState(30)
    const [verifying, setVerifying] = useState(false)
    const inputRefs = useRef([])

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    useEffect(() => {
        if (resendTimer > 0) {
            const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
            return () => clearTimeout(t)
        }
    }, [resendTimer])

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        setError('')

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pasted.length === 6) {
            setOtp(pasted.split(''))
            inputRefs.current[5]?.focus()
        }
    }

    const handleVerify = async () => {
        const code = otp.join('')
        if (code.length !== 6) {
            setError('Please enter the complete 6-digit code')
            return
        }
        setVerifying(true)
        // Simulate OTP verification
        await new Promise(r => setTimeout(r, 1000))
        setVerifying(false)
        onVerify(code)
    }

    const handleResend = () => {
        if (resendTimer > 0) return
        setResendTimer(30)
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
    }

    return (
        <div className="animate-fade-up" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 8 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}>
                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
                Verify Your Email
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                We've sent a 6-digit code to
            </p>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: 24 }}>
                {email || 'your email'}
            </p>

            <div className="otp-inputs" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        ref={el => inputRefs.current[i] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleChange(i, e.target.value)}
                        onKeyDown={e => handleKeyDown(i, e)}
                    />
                ))}
            </div>

            {error && <p className="error-text" style={{ textAlign: 'center', marginBottom: 16 }}>{error}</p>}

            <button
                className="btn btn-primary"
                onClick={handleVerify}
                disabled={verifying}
                style={{ marginBottom: 16 }}
            >
                {verifying ? 'Verifying…' : 'Verify Code'}
            </button>

            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                Didn't receive the code?{' '}
                {resendTimer > 0 ? (
                    <span>Resend in <strong>{resendTimer}s</strong></span>
                ) : (
                    <button className="btn-link" onClick={handleResend}>Resend OTP</button>
                )}
            </p>

            {onBack && (
                <button className="btn btn-secondary" onClick={onBack} style={{ marginTop: 16, width: '100%' }}>
                    ← Back
                </button>
            )}
        </div>
    )
}
