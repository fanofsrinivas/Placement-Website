import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import styles from '../Dashboard.module.css';

const UserVerification = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [roleFilter, setRoleFilter] = useState('');
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/verify?page=${page}&limit=10&role=${roleFilter}&search=${search}`);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { fetchUsers(); }, [page, roleFilter, search]);

    const handleAction = async (id, action, reason = '') => {
        try {
            await api.put(`/admin/verify/${id}`, { action, reason });
            toast.success(`User ${action}d successfully!`);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>User Verification</h1>
                <p>Review and verify student/company registrations</p>
            </div>

            <div className={styles.filters}>
                <input placeholder="Search by name or email..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
                    <option value="">All Roles</option>
                    <option value="student">Students</option>
                    <option value="company">Companies</option>
                </select>
            </div>

            {loading ? <LoadingSkeleton /> : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>Email</th><th>Role</th><th>Name/Company</th><th>Details</th><th>Email Verified</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td style={{ fontWeight: 500 }}>{u.email}</td>
                                    <td><span className={`badge badge-${u.role === 'student' ? 'info' : 'primary'}`}>{u.role}</span></td>
                                    <td>
                                        {u.role === 'student'
                                            ? `${u.studentProfile?.firstName || ''} ${u.studentProfile?.lastName || ''}`
                                            : u.companyProfile?.companyName || ''}
                                    </td>
                                    <td style={{ fontSize: 13 }}>
                                        {u.role === 'student'
                                            ? `${u.studentProfile?.branch || ''} | CGPA: ${u.studentProfile?.cgpa || 'N/A'} | Roll: ${u.studentProfile?.rollNumber || ''}`
                                            : `${u.companyProfile?.industry || ''} | ${u.companyProfile?.website || ''}`
                                        }
                                    </td>
                                    <td>
                                        <span className={`badge badge-${u.isEmailVerified ? 'success' : 'warning'}`}>
                                            {u.isEmailVerified ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button className="btn btn-sm btn-success" onClick={() => handleAction(u._id, 'approve')}>
                                                ✓ Approve
                                            </button>
                                            <button className="btn btn-sm btn-danger" onClick={() => {
                                                const reason = prompt('Rejection reason:');
                                                if (reason) handleAction(u._id, 'reject', reason);
                                            }}>
                                                ✕ Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No pending verifications</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span>Page {page} of {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            )}
        </div>
    );
};

export default UserVerification;
