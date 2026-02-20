export default function RegistrationProgress({ currentStep, steps }) {
    return (
        <div className="progress-bar">
            {steps.map((label, i) => {
                const stepNum = i + 1
                const isActive = stepNum === currentStep
                const isCompleted = stepNum < currentStep

                return (
                    <div className="progress-step" key={stepNum}>
                        {i > 0 && (
                            <div className={`progress-step__connector${isCompleted ? ' completed' : ''}`} />
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className={`progress-step__circle${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}>
                                {isCompleted ? '✓' : stepNum}
                            </div>
                            <span className={`progress-step__label${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}>
                                {label}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
