import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiSearch, FiDownload, FiFilter, FiUsers, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import dashStyles from '../Dashboard.module.css';

const DepartmentStudents = () => {
    const { api } = useAuth();
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [branch, setBranch] = useState('');
    const [placed, setPlaced] = useState('');
    const [degree, setDegree] = useState('');
    const [sortField, setSortField] = useState('name');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 50, sort: sortField });
            if (search) params.append('search', search);
            if (branch) params.append('branch', branch);
            if (placed) params.append('placed', placed);
            if (degree) params.append('degree', degree);

            const res = await api.get(`/faculty/students?${params}`);
            setStudents(res.data.students || []);
            setDepartments(res.data.departments || []);
            setStats(res.data.stats || {});
            setTotalPages(res.data.totalPages || 1);
            setTotal(res.data.total || 0);
        } catch (err) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStudents(); }, [page, sortField, branch, placed, degree]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchStudents();
    };

    const handleExport = async () => {
        try {
            const res = await api.get('/faculty/students/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Department_Students.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Export downloaded!');
        } catch (err) {
            toast.error('Export failed');
        }
    };

    return (
        <div className={dashStyles.dashboardPage}>
            <div className={dashStyles.dashboardHeader}>
                <h1>Department Students</h1>
                <p>View and manage students in your department(s)</p>
            </div>

            {/* Stats Bar */}
            <div style={{
                display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap',
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, background: '#f0f4ff',
                    padding: '12px 20px', borderRadius: 10, border: '1px solid #dbeafe',
                }}>
                    <FiUsers style={{ color: '#6366f1', fontSize: 20 }} />
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#6366f1' }}>{stats.totalStudents || 0}</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>Total Students</div>
                    </div>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, background: '#ecfdf5',
                    padding: '12px 20px', borderRadius: 10, border: '1px solid #a7f3d0',
                }}>
                    <FiCheckCircle style={{ color: '#10b981', fontSize: 20 }} />
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#10b981' }}>{stats.placedStudents || 0}</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>Placed</div>
                    </div>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, background: '#fffbeb',
                    padding: '12px 20px', borderRadius: 10, border: '1px solid #fde68a',
                }}>
                    <FiTrendingUp style={{ color: '#f59e0b', fontSize: 20 }} />
                    <div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}>{stats.placementRate || 0}%</div>
                        <div style={{ fontSize: 11, color: '#6b7280' }}>Placement Rate</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'flex-end',
            }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, flex: 1, minWidth: 200 }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <FiSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, roll, email..."
                            style={{ paddingLeft: 36, width: '100%' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">Search</button>
                </form>

                {departments.length > 1 && (
                    <select value={branch} onChange={(e) => { setBranch(e.target.value); setPage(1); }}
                        style={{ minWidth: 180 }}>
                        <option value="">All Departments</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                )}

                <select value={placed} onChange={(e) => { setPlaced(e.target.value); setPage(1); }}>
                    <option value="">All Status</option>
                    <option value="yes">Placed</option>
                    <option value="no">Not Placed</option>
                </select>

                <select value={degree} onChange={(e) => { setDegree(e.target.value); setPage(1); }}>
                    <option value="">All Degrees</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MSc">MSc</option>
                    <option value="MCA">MCA</option>
                    <option value="PhD">PhD</option>
                    <option value="Dual Degree">Dual Degree</option>
                    <option value="Integrated MSc">Integrated MSc</option>
                </select>

                <select value={sortField} onChange={(e) => { setSortField(e.target.value); setPage(1); }}>
                    <option value="name">Sort: Name</option>
                    <option value="cgpa">Sort: CGPA</option>
                    <option value="roll">Sort: Roll No</option>
                    <option value="recent">Sort: Recent</option>
                </select>

                <button onClick={handleExport} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FiDownload /> Export
                </button>
            </div>

            {/* Students Table */}
            {loading ? (
                <div className={dashStyles.loading}>Loading students...</div>
            ) : (
                <>
                    <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-light)' }}>
                        Showing {students.length} of {total} students
                    </div>
                    <div className={dashStyles.tableWrapper}>
                        <table className={dashStyles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Roll No</th>
                                    <th>Branch</th>
                                    <th>Degree</th>
                                    <th>CGPA</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Company</th>
                                    <th>Package</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr><td colSpan="9" style={{ textAlign: 'center', padding: 32, color: '#9ca3af' }}>No students found</td></tr>
                                ) : students.map((s) => (
                                    <tr key={s._id}>
                                        <td style={{ fontWeight: 600 }}>{s.name || 'N/A'}</td>
                                        <td>{s.rollNumber}</td>
                                        <td style={{ fontSize: 12 }}>{s.branch}</td>
                                        <td>{s.degree}</td>
                                        <td>
                                            <span style={{
                                                fontWeight: 700,
                                                color: s.cgpa >= 8 ? '#10b981' : s.cgpa >= 6 ? '#f59e0b' : '#ef4444',
                                            }}>
                                                {s.cgpa || 'N/A'}
                                            </span>
                                        </td>
                                        <td>{s.phone || '-'}</td>
                                        <td>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                                                background: s.isPlaced ? '#ecfdf5' : '#fef3c7',
                                                color: s.isPlaced ? '#065f46' : '#92400e',
                                                border: `1px solid ${s.isPlaced ? '#a7f3d0' : '#fde68a'}`,
                                            }}>
                                                {s.isPlaced ? '✓ Placed' : 'Not Placed'}
                                            </span>
                                        </td>
                                        <td>{s.placedCompany || '-'}</td>
                                        <td style={{ fontWeight: s.placedPackage ? 700 : 400, color: s.placedPackage ? '#6366f1' : '#9ca3af' }}>
                                            {s.placedPackage ? `${s.placedPackage} LPA` : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                            <button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                                ← Previous
                            </button>
                            <span style={{ padding: '6px 16px', fontSize: 13, color: 'var(--text-light)' }}>
                                Page {page} of {totalPages}
                            </span>
                            <button className="btn btn-outline btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DepartmentStudents;
