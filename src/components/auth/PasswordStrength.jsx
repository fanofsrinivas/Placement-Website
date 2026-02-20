export default function PasswordStrength({ password }) {
    const checks = [
        { label: '8+ characters', pass: password.length >= 8 },
        { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
        { label: 'Number', pass: /\d/.test(password) },
        { label: 'Special character', pass: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ]

    const score = checks.filter(c => c.pass).length

    const levels = [
        { label: '', color: 'var(--border-light)' },
        { label: 'Weak', color: 'var(--strength-weak)' },
        { label: 'Fair', color: 'var(--strength-fair)' },
        { label: 'Good', color: 'var(--strength-good)' },
        { label: 'Strong', color: 'var(--strength-strong)' },
    ]

    const { label, color } = levels[score]

    if (!password) return null

    return (
        <div className="strength-meter">
            <div className="strength-meter__bars">
                {[1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        className="strength-meter__bar"
                        style={{ background: i <= score ? color : undefined }}
                    />
                ))}
            </div>
            <p className="strength-meter__text" style={{ color }}>{label}</p>
        </div>
    )
}
