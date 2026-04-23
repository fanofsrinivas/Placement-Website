import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import dashStyles from '../Dashboard.module.css';

const branches = [
    'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering',
    'Electronics and Communication Engineering', 'Metallurgical and Materials Engineering',
    'Chemical Engineering', 'Computer Science and Engineering', 'Biotechnology',
    'Electronics and Communication Engineering (VLSI Design and Technology)',
    'Mathematics and Computing',
    'Computer Science and Engineering (Artificial Intelligence & Data Science)',
    'Integrated M.Sc. Mathematics', 'Integrated M.Sc. Physics', 'Integrated M.Sc. Chemistry',
    'Dual Degree - Chemical Engineering', 'Dual Degree - Metallurgical and Materials Engineering',
    'Other',
];

const degrees = ['B.Tech', 'M.Tech', 'MSc', 'MCA', 'PhD', 'Dual Degree', 'Integrated MSc'];

const emptyDrive = {
    title: '', academicYear: '', description: '', startDate: '', endDate: '',
    status: 'upcoming',
    eligibility: { branches: [], minCGPA: 0, maxBacklogs: 0, degrees: [], passingYears: [] },
};

const DriveManagement = () => {
    const { api } = useAuth();
    const [drives, setDrives] = useState([]);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ ...emptyDrive });
    const [loading, setLoading] = useState(true);

    const fetchDrives = async () => {
        try {
            const res = await api.get('/coordinator/drives', { params: { search } });
            setDrives(res.data.drives);
        } catch (err) {
            toast.error('Failed to load drives');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDrives(); }, [search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/coordinator/drives/${editingId}`, form);
                toast.success('Drive updated');
            } else {
                await api.post('/coordinator/drives', form);
                toast.success('Drive created');
            }
            setShowForm(false);
            setEditingId(null);
            setForm({ ...emptyDrive });
            fetchDrives();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (drive) => {
        setForm({
            title: drive.title,
            academicYear: drive.academicYear,
            description: drive.description || '',
            startDate: drive.startDate?.split('T')[0] || '',
            endDate: drive.endDate?.split('T')[0] || '',
            status: drive.status,
            eligibility: drive.eligibility || emptyDrive.eligibility,
        });
        setEditingId(drive._id);
        setShowForm(true);
    };

    const toggleBranch = (branch) => {
        const current = form.eligibility.branches || [];
        const updated = current.includes(branch)
            ? current.filter((b) => b !== branch)
            : [...current, branch];
        setForm({ ...form, eligibility: { ...form.eligibility, branches: updated } });
    };

    const toggleAllBranches = () => {
        const allSelected = form.eligibility.branches.length === branches.length;
        setForm({
            ...form,
            eligibility: { ...form.eligibility, branches: allSelected ? [] : [...branches] },
        });
    };

    if (loading) return <div className={dashStyles.loading}>Loading drives...</div>;

    return (
        <div className={dashStyles.dashboardPage}>
            <div className={dashStyles.dashboardHeader}>
                <h1>Drive Management</h1>
                <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyDrive }); }}>
                    <FiPlus /> Create Drive
                </button>
            </div>

            <div className={dashStyles.searchBar}>
                <FiSearch />
                <input placeholder="Search drives..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {showForm && (
                <div className={dashStyles.formCard}>
                    <h2>{editingId ? 'Edit Drive' : 'Create New Drive'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title *</label>
                            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Campus Placement Drive 2025-26" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label>Academic Year *</label>
                                <input required value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} placeholder="e.g. 2025-2026" />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Drive description..." />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label>Start Date *</label>
                                <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                Eligible Branches
                                <button type="button" onClick={toggleAllBranches} style={{
                                    marginLeft: 12, background: 'none', border: '1px solid var(--primary)',
                                    color: 'var(--primary)', borderRadius: 4, padding: '2px 8px', fontSize: 12, cursor: 'pointer',
                                }}>
                                    {form.eligibility.branches.length === branches.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 6, maxHeight: 220, overflowY: 'auto', padding: 8, border: '1px solid var(--border)', borderRadius: 8 }}>
                                {branches.map((b) => (
                                    <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                                        <input type="checkbox" checked={form.eligibility.branches.includes(b)} onChange={() => toggleBranch(b)} />
                                        {b}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div className="form-group">
                                <label>Min CGPA</label>
                                <input type="number" step="0.1" min="0" max="10" value={form.eligibility.minCGPA} onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, minCGPA: parseFloat(e.target.value) || 0 } })} />
                            </div>
                            <div className="form-group">
                                <label>Max Backlogs</label>
                                <input type="number" min="0" value={form.eligibility.maxBacklogs} onChange={(e) => setForm({ ...form, eligibility: { ...form.eligibility, maxBacklogs: parseInt(e.target.value) || 0 } })} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button type="submit" className="btn btn-primary">{editingId ? 'Update Drive' : 'Create Drive'}</button>
                            <button type="button" className="btn" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className={dashStyles.tableWrapper}>
                <table className={dashStyles.dataTable}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Academic Year</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>Branches</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drives.length === 0 ? (
                            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>No drives found. Create your first drive!</td></tr>
                        ) : drives.map((drive) => (
                            <tr key={drive._id}>
                                <td><strong>{drive.title}</strong></td>
                                <td>{drive.academicYear}</td>
                                <td><span className={`${dashStyles.badge} ${dashStyles[drive.status]}`}>{drive.status}</span></td>
                                <td>{new Date(drive.startDate).toLocaleDateString()}</td>
                                <td style={{ fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {drive.eligibility?.branches?.join(', ') || 'All'}
                                </td>
                                <td>
                                    <button className="btn btn-sm" onClick={() => handleEdit(drive)} title="Edit"><FiEdit2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DriveManagement;
