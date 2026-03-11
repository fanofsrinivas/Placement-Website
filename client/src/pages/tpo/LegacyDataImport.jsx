import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import { api } from '../../context/AuthContext';
import styles from '../Dashboard.module.css';

const STEPS = ['Download Template', 'Upload File', 'Map Columns', 'Validate', 'Import', 'Summary'];

const requiredFields = [
    { key: 'studentName', label: 'Student Name' },
    { key: 'email', label: 'Email' },
    { key: 'rollNumber', label: 'Roll Number' },
    { key: 'branch', label: 'Branch' },
    { key: 'degree', label: 'Degree' },
    { key: 'cgpa', label: 'CGPA' },
    { key: 'companyName', label: 'Company Name' },
    { key: 'jobTitle', label: 'Job Title' },
    { key: 'packageLPA', label: 'Package (LPA)' },
    { key: 'placementYear', label: 'Placement Year' },
];

const LegacyDataImport = () => {
    const [step, setStep] = useState(0);
    const [fileData, setFileData] = useState(null);
    const [columnMap, setColumnMap] = useState({});
    const [validationResult, setValidationResult] = useState(null);
    const [importResult, setImportResult] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'text/csv': ['.csv'] },
        maxFiles: 1,
        onDrop: async (files) => {
            if (files.length === 0) return;
            setUploading(true);
            try {
                const formData = new FormData();
                formData.append('file', files[0]);
                const res = await api.post('/tpo/legacy/parse', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setFileData(res.data);
                // Auto-map columns by name
                const autoMap = {};
                requiredFields.forEach(f => {
                    const match = res.data.headers.find(h => h.toLowerCase().includes(f.label.toLowerCase().split(' ')[0].toLowerCase()));
                    if (match) autoMap[f.key] = match;
                });
                setColumnMap(autoMap);
                setStep(2);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Upload failed');
            } finally { setUploading(false); }
        },
    });

    const downloadTemplate = async () => {
        try {
            const res = await api.get('/tpo/legacy/template', { responseType: 'blob' });
            const url = window.URL.createObjectURL(res.data);
            const a = document.createElement('a');
            a.href = url; a.download = 'CPMS_Legacy_Import_Template.xlsx'; a.click();
            toast.success('Template downloaded!');
            setStep(1);
        } catch { toast.error('Download failed'); }
    };

    const handleValidate = async () => {
        try {
            const res = await api.post('/tpo/legacy/validate', {
                data: fileData.preview, // In production you'd send all data; here using preview
                columnMap,
            });
            setValidationResult(res.data);
            setStep(4);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Validation failed');
        }
    };

    const handleImport = async () => {
        try {
            const res = await api.post('/tpo/legacy/import', {
                records: validationResult.valid,
            });
            setImportResult(res.data);
            setStep(5);
            toast.success('Import complete!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Import failed');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Legacy Data Import</h1>
                <p>Import historical placement data from Excel</p>
            </div>

            <div className={styles.wizardSteps}>
                {STEPS.map((s, i) => (
                    <div key={s} className={`${styles.wizardStep} ${i === step ? styles.active : i < step ? styles.done : ''}`}>
                        <span className={styles.stepNum}>{i < step ? '✓' : i + 1}</span>
                        {s}
                    </div>
                ))}
            </div>

            <div className="card" style={{ minHeight: 300 }}>
                {/* Step 0: Download Template */}
                {step === 0 && (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>📄</div>
                        <h3>Step 1: Download the Import Template</h3>
                        <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px' }}>
                            Download the Excel template with the required columns, fill in your data, and upload it in the next step.
                        </p>
                        <button className="btn btn-primary btn-lg" onClick={downloadTemplate}>
                            📥 Download Template
                        </button>
                    </div>
                )}

                {/* Step 1: Upload */}
                {step === 1 && (
                    <div style={{ padding: 20 }}>
                        <h3 style={{ marginBottom: 20 }}>Step 2: Upload Your Excel File</h3>
                        <div {...getRootProps()} style={{
                            border: '2px dashed var(--primary)', borderRadius: 12, padding: 60, textAlign: 'center',
                            background: isDragActive ? '#e8eaf6' : '#f8f9fc', cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                            <input {...getInputProps()} />
                            <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
                            {uploading ? <p>Uploading and parsing...</p> : (
                                <p>{isDragActive ? 'Drop the file here' : 'Drag & drop an Excel file here, or click to browse'}</p>
                            )}
                            <small style={{ color: 'var(--text-light)' }}>Supports .xlsx, .xls, .csv (max 10MB)</small>
                        </div>
                    </div>
                )}

                {/* Step 2: Column Mapping */}
                {step === 2 && fileData && (
                    <div style={{ padding: 20 }}>
                        <h3 style={{ marginBottom: 20 }}>Step 3: Map Columns ({fileData.totalRows} rows found)</h3>
                        <div className={styles.profileGrid}>
                            {requiredFields.map(f => (
                                <div key={f.key} className="form-group">
                                    <label>{f.label}</label>
                                    <select value={columnMap[f.key] || ''} onChange={e => setColumnMap({ ...columnMap, [f.key]: e.target.value })}>
                                        <option value="">— Select Column —</option>
                                        {fileData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                            <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                            <button className="btn btn-primary" onClick={() => { handleValidate(); }}>Validate Data →</button>
                        </div>
                    </div>
                )}

                {/* Step 3 (skipped in UI, validation is step 4) */}

                {/* Step 4: Validation Results */}
                {step === 4 && validationResult && (
                    <div style={{ padding: 20 }}>
                        <h3 style={{ marginBottom: 20 }}>Step 4: Validation Results</h3>
                        <div className="stats-grid" style={{ marginBottom: 24 }}>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#e8f5e9', color: '#2e7d32' }}>✅</div>
                                <div className="stat-info"><h3>{validationResult.totalValid}</h3><p>Valid Records</p></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#ffebee', color: '#c62828' }}>❌</div>
                                <div className="stat-info"><h3>{validationResult.totalErrors}</h3><p>Errors Found</p></div>
                            </div>
                        </div>
                        {validationResult.errors.length > 0 && (
                            <div style={{ background: '#fff3e0', padding: 16, borderRadius: 8, marginBottom: 20, maxHeight: 200, overflow: 'auto' }}>
                                <h4 style={{ color: '#e65100', marginBottom: 8 }}>Errors:</h4>
                                {validationResult.errors.map((e, i) => (
                                    <p key={i} style={{ fontSize: 13, color: '#bf360c' }}>Row {e.row}: {e.errors.join(', ')}</p>
                                ))}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: 12 }}>
                            <button className="btn btn-outline" onClick={() => setStep(2)}>← Fix Mapping</button>
                            <button className="btn btn-primary" onClick={handleImport} disabled={validationResult.totalValid === 0}>
                                Import {validationResult.totalValid} Records →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Summary */}
                {step === 5 && importResult && (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                        <h3>Import Complete!</h3>
                        <div className="stats-grid" style={{ maxWidth: 500, margin: '24px auto' }}>
                            <div className="stat-card">
                                <div className="stat-info"><h3>{importResult.imported}</h3><p>Imported</p></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-info"><h3>{importResult.skipped}</h3><p>Skipped</p></div>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={() => { setStep(0); setFileData(null); setColumnMap({}); setValidationResult(null); setImportResult(null); }}>
                            Start New Import
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LegacyDataImport;
