export default function PlacementProcess() {
    const steps = ["Registration", "Aptitude Test", "Technical Interview", "HR Round"];
    return (
        <section className="process-section" style={{ padding: '20px' }}>
            <h2>Our Placement Process</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                {steps.map((step, index) => (
                    <div key={index}><strong>{index + 1}.</strong> {step}</div>
                ))}
            </div>
        </section>
    );
}