import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { FiDownload, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import dashStyles from '../Dashboard.module.css';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const stages = ['Applied', 'Screening', 'Test', 'Tech Interview', 'HR', 'Selected', 'Rejected'];

const ApplicationDataGrid = () => {
    const { api } = useAuth();
    const gridRef = useRef(null);
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stageFilter, setStageFilter] = useState('');
    const [total, setTotal] = useState(0);

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (stageFilter) params.stage = stageFilter;
            const res = await api.get('/coordinator/applications', { params });
            setRowData(res.data.applications || []);
            setTotal(res.data.total || 0);
        } catch (err) {
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    }, [api, search, stageFilter]);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);

    const handleStageChange = async (appId, newStage) => {
        try {
            await api.put(`/coordinator/applications/${appId}`, { stage: newStage });
            toast.success(`Stage updated to ${newStage}`);
            fetchApplications();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update stage');
        }
    };

    const handleExport = async () => {
        try {
            const res = await api.get('/coordinator/applications/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Applications_Export.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Export downloaded!');
        } catch (err) {
            toast.error('Export failed');
        }
    };

    const StageCellRenderer = (params) => {
        const stageColors = {
            Applied: '#6366f1', Screening: '#f59e0b', Test: '#8b5cf6',
            'Tech Interview': '#3b82f6', HR: '#ec4899', Selected: '#10b981', Rejected: '#ef4444',
        };
        return (
            <select
                value={params.value}
                onChange={(e) => handleStageChange(params.data._id, e.target.value)}
                style={{
                    border: 'none', background: stageColors[params.value] || '#6b7280',
                    color: '#fff', borderRadius: 4, padding: '2px 8px', fontSize: 12,
                    fontWeight: 600, cursor: 'pointer', outline: 'none',
                }}
            >
                {stages.map((s) => (
                    <option key={s} value={s} style={{ background: '#fff', color: '#333' }}>{s}</option>
                ))}
            </select>
        );
    };

    const columnDefs = [
        { headerName: 'Student Name', field: 'studentName', filter: true, sortable: true, minWidth: 160 },
        { headerName: 'Roll No', field: 'rollNumber', filter: true, sortable: true, width: 120 },
        { headerName: 'Branch', field: 'branch', filter: true, sortable: true, minWidth: 180 },
        { headerName: 'Degree', field: 'degree', filter: true, sortable: true, width: 110 },
        { headerName: 'CGPA', field: 'cgpa', filter: 'agNumberColumnFilter', sortable: true, width: 90 },
        { headerName: 'Email', field: 'email', filter: true, minWidth: 200 },
        { headerName: 'Phone', field: 'phone', filter: true, width: 120 },
        { headerName: 'Job Title', field: 'jobTitle', filter: true, sortable: true, minWidth: 160 },
        { headerName: 'Company', field: 'companyName', filter: true, sortable: true, minWidth: 140 },
        { headerName: 'Job Type', field: 'jobType', filter: true, width: 130 },
        {
            headerName: 'Stage', field: 'stage', width: 140,
            cellRenderer: StageCellRenderer,
        },
        {
            headerName: 'Applied', field: 'appliedDate', sortable: true, width: 110,
            valueFormatter: (params) => params.value ? new Date(params.value).toLocaleDateString() : '',
        },
    ];

    const defaultColDef = {
        resizable: true,
        flex: 0,
    };

    return (
        <div className={dashStyles.dashboardPage}>
            <div className={dashStyles.dashboardHeader}>
                <div>
                    <h1>Application Data</h1>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: 14 }}>
                        {total} total applications — Edit stages directly in the grid
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" onClick={fetchApplications} title="Refresh">
                        <FiRefreshCw /> Refresh
                    </button>
                    <button className="btn btn-primary" onClick={handleExport}>
                        <FiDownload /> Export Excel
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                <div className={dashStyles.searchBar} style={{ flex: 1, minWidth: 200 }}>
                    <FiSearch />
                    <input
                        placeholder="Search by name, email, or roll number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiFilter style={{ color: 'var(--text-light)' }} />
                    <select
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14 }}
                    >
                        <option value="">All Stages</option>
                        {stages.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ width: '100%', height: 'calc(100vh - 280px)', minHeight: 400 }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={50}
                    paginationPageSizeSelector={[25, 50, 100]}
                    rowSelection="multiple"
                    animateRows={true}
                    loading={loading}
                    overlayNoRowsTemplate='<span style="padding: 30px;">No applications found for your drives</span>'
                    theme="legacy"
                />
            </div>
        </div>
    );
};

export default ApplicationDataGrid;
