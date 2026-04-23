import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiDownload, FiSearch, FiFilter, FiRefreshCw, FiUsers, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import dashStyles from '../Dashboard.module.css';

const DepartmentStudents = () => {
    const { api } = useAuth();
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [placedFilter, setPlacedFilter] = useState('');
    const [sortField, setSortField] = useState('name');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [expandedStudent, setExpandedStudent] = useState(null);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 50, sort: sortField };
            if (search) params.search = search;
            if (branchFilter) params.branch = branchFilter;
            if (placedFilter) params.placed = placedFilter;
            const res = await api.get('/coordinator/students', { params });
            setStudents(res.data.students || []);
            setDepartments(res.data.departments || []);
            setStats(res.data.stats || null);
            setTotalPages(res.data.totalPages || 1);
            setTotal(res.data.total || 0);
        } catch (err) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    }, [api, page, sortField, branchFilter, placedFilter]);

    useEffect(() => { fetchStudents(); }, [fetchStudents]);

    useEffect(() => {
        const timer = setTimeout(() => { setPage(1); fetchStudents(); }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    const handleExport = async () => {
        try {
            const res = await api.get('/coordinator/students/export', { responseType: 'blob' });
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
                <div>
                    <h1>Department Students</h1>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-light)', fontSize: 14 }}>
                        {departments.length > 0
                            ? `Managing: ${departments.join(', ')}`
                            : 'All departments (no specific departments assigned)'}
                        {' • '}{total} students
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" onClick={fetchStudents} title="Refresh"><FiRefreshCw /> Refresh</button>
                    <button className="btn btn-primary" onClick={handleExport}><FiDownload /> Export Excel</button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                    <div style={{
                        background: '#fff', borderRadius: 12, padding: '16px 24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', flex: 1, minWidth: 160,
                        borderTop: '3px solid #6366f1',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FiUsers style={{ color: '#6366f1', fontSize: 22 }} />
                            <div>
                                <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totalStudents}</div>
                                <div style={{ fontSize: 12, color: '#666' }}>Total Students</div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        background: '#fff', borderRadius: 12, padding: '16px 24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', flex: 1, minWidth: 160,
                        borderTop: '3px solid #10b981',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FiCheckCircle style={{ color: '#10b981', fontSize: 22 }} />
                            <div>
                                <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.placedStudents}</div>
                                <div style={{ fontSize: 12, color: '#666' }}>Placed</div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        background: '#fff', borderRadius: 12, padding: '16px 24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)', flex: 1, minWidth: 160,
                        borderTop: '3px solid #f59e0b',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <FiTrendingUp style={{ color: '#f59e0b', fontSize: 22 }} />
                            <div>
                                <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.placementRate}%</div>
                                <div style={{ fontSize: 12, color: '#666' }}>Placement Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <div className={dashStyles.searchBar} style={{ flex: 1, minWidth: 220 }}>
                    <FiSearch />
                    <input
                        placeholder="Search by name, email, or roll number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiFilter style={{ color: 'var(--text-light)' }} />
                    {departments.length > 1 && (
                        <select value={branchFilter} onChange={e => { setBranchFilter(e.target.value); setPage(1); }}
                            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}>
                            <option value="">All Departments</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    )}
                    <select value={placedFilter} onChange={e => { setPlacedFilter(e.target.value); setPage(1); }}
                        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}>
                        <option value="">All Status</option>
                        <option value="yes">Placed</option>
                        <option value="no">Not Placed</option>
                    </select>
                    <select value={sortField} onChange={e => setSortField(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}>
                        <option value="name">Sort: Name</option>
                        <option value="cgpa">Sort: CGPA ↓</option>
                        <option value="roll">Sort: Roll No.</option>
                        <option value="recent">Sort: Recent</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className={dashStyles.tableWrapper}>
                <table className={dashStyles.dataTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Roll No.</th>
                            <th>Email</th>
                            <th>Branch</th>
                            <th>Degree</th>
                            <th>CGPA</th>
                            <th>Phone</th>
                            <th>Year</th>
                            <th>Placement</th>
                            <th>Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                                {loading ? 'Loading...' : 'No students found for your department(s).'}
                            </td></tr>
                        ) : students.map((s) => (
                            <>
                                <tr key={s._id}
                                    onClick={() => setExpandedStudent(expandedStudent === s._id ? null : s._id)}
                                    style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                    <td style={{ fontWeight: 600 }}>{s.name || 'N/A'}</td>
                                    <td>{s.rollNumber || '-'}</td>
                                    <td style={{ fontSize: 12 }}>{s.email}</td>
                                    <td style={{ fontSize: 12 }}>{s.branch || '-'}</td>
                                    <td>{s.degree || '-'}</td>
                                    <td style={{ fontWeight: 600 }}>{s.cgpa || '-'}</td>
                                    <td>{s.phone || '-'}</td>
                                    <td>{s.passingYear || '-'}</td>
                                    <td>
                                        {s.isPlaced ? (
                                            <span style={{
                                                background: '#10b981', color: '#fff',
                                                padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                            }}>
                                                {s.placedCompany || 'Placed'}
                                            </span>
                                        ) : (
                                            <span style={{
                                                background: '#f1f5f9', color: '#64748b',
                                                padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                            }}>
                                                Not Placed
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{
                                            background: `linear-gradient(90deg, #6366f1 ${s.profileCompleted}%, #e2e8f0 ${s.profileCompleted}%)`,
                                            height: 6, borderRadius: 3, width: 60,
                                        }} title={`${s.profileCompleted}% complete`} />
                                    </td>
                                </tr>
                                {expandedStudent === s._id && (
                                    <tr key={`${s._id}-detail`}>
                                        <td colSpan={10} style={{ background: '#f8fafc', padding: '16px 24px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>Gender</strong>
                                                    <p style={{ margin: '2px 0' }}>{s.gender || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>Active Backlogs</strong>
                                                    <p style={{ margin: '2px 0' }}>{s.activeBacklogs}</p>
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>Placed Package</strong>
                                                    <p style={{ margin: '2px 0' }}>{s.placedPackage ? `${s.placedPackage} LPA` : 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>Profile Complete</strong>
                                                    <p style={{ margin: '2px 0' }}>{s.profileCompleted}%</p>
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>Verified</strong>
                                                    <p style={{ margin: '2px 0' }}>{s.isVerified ? '✅ Yes' : '⏳ Pending'}</p>
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: 12, color: '#666' }}>Email Verified</strong>
                                                    <p style={{ margin: '2px 0' }}>{s.isEmailVerified ? '✅ Yes' : '❌ No'}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                    <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>Page {page} of {totalPages}</span>
                    <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
            )}
        </div>
    );
};

export default DepartmentStudents;
