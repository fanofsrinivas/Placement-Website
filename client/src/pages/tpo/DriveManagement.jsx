import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from '../Dashboard.module.css';

const DriveManagement = () => {
    const [drives, setDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', academicYear: '', description: '', startDate: '', endDate: '', status: 'upcoming' });
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchDrives = async () => {
        try {
            const res = await api.get('/tpo/drives');
            setDrives(res.data.drives);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchDrives(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editId) {
                await api.put(`/tpo/drives/${editId}`, form);
                toast.success('Drive updated!');
            } else {
                await api.post('/tpo/drives', form);
                toast.success('Drive created!');
            }
            setShowModal(false);
            setForm({ title: '', academicYear: '', description: '', startDate: '', endDate: '', status: 'upcoming' });
            setEditId(null);
            fetchDrives();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this drive?')) return;
        try { await api.delete(`/tpo/drives/${id}`); toast.success('Deleted'); fetchDrives(); }
        catch { toast.error('Delete failed'); }
    };

    if (loading) return <LoadingSkeleton />;

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><h1>Drive Management</h1><p>Manage placement drives</p></div>
                <button className="btn btn-primary" onClick={() => { setForm({ title: '', academicYear: '', description: '', startDate: '', endDate: '', status: 'upcoming' }); setEditId(null); setShowModal(true); }}>
                    + Create Drive
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr><th>Title</th><th>Year</th><th>Status</th><th>Start</th><th>End</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {drives.map(d => (
                            <tr key={d._id}>
                                <td style={{ fontWeight: 600 }}>{d.title}</td>
                                <td>{d.academicYear}</td>
                                <td><span className={`badge badge-${d.status === 'active' ? 'success' : d.status === 'completed' ? 'info' : 'warning'}`}>{d.status}</span></td>
                                <td>{new Date(d.startDate).toLocaleDateString()}</td>
                                <td>{d.endDate ? new Date(d.endDate).toLocaleDateString() : '–'}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button className="btn btn-sm btn-outline" onClick={() => { setForm({ ...d, startDate: d.startDate?.split('T')[0], endDate: d.endDate?.split('T')[0] || '' }); setEditId(d._id); setShowModal(true); }}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(d._id)}>×</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {drives.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No drives created</td></tr>}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h2>{editId ? 'Edit Drive' : 'Create Drive'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group"><label>Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                            <div className="form-group"><label>Academic Year *</label><input required value={form.academicYear} onChange={e => setForm({ ...form, academicYear: e.target.value })} placeholder="e.g. 2025-2026" /></div>
                            <div className="form-group"><label>Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div className="form-group"><label>Start Date *</label><input type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
                                <div className="form-group"><label>End Date</label><input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriveManagement;
