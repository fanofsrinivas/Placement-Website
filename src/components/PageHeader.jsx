export default function PageHeader({ title }) {
    return (
        <div style={{ padding: '30px', background: '#f4f4f4', textAlign: 'center', borderBottom: '2px solid #ccc' }}>
            <h1>{title}</h1>
        </div>
    );
}