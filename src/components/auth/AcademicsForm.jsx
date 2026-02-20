import { useState } from 'react'

const DEGREES = ['B.Tech', 'B.E.', 'M.Tech', 'M.E.', 'MCA', 'MBA', 'B.Sc', 'M.Sc']
const BRANCHES = [
    'Computer Science and Engineering',
    'Computer Science and Engineering (Artificial Intelligence & Data Science)',
    'Mathematics and Computing',
    'Electronics and Communication Engineering',
    'Electronics and Communication Engineering (VLSI Design)',
    'Electrical and Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biotechnology',
]

export default function AcademicsForm({ data, onChange, onNext, onBack }) {
    const [errors, setErrors] = useState({})

    const validate = () => {
        const errs = {}
        if (!data.degree) errs.degree = 'Select your degree'
        if (!data.branch) errs.branch = 'Select your branch'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) onNext()
    }

    const handleChange = (field) => (e) => {
        onChange({ ...data, [field]: e.target.value })
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    return (
        <form onSubmit={handleSubmit} className="animate-fade-up">
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="degree">Degree</label>
                    <select
                        id="degree" value={data.degree || ''}
                        onChange={handleChange('degree')}
                        className={errors.degree ? 'error' : ''}
                    >
                        <option value="">Select Degree</option>
                        {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    {errors.degree && <p className="error-text">{errors.degree}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="branch">Branch / Specialization</label>
                    <select
                        id="branch" value={data.branch || ''}
                        onChange={handleChange('branch')}
                        className={errors.branch ? 'error' : ''}
                    >
                        <option value="">Select Branch</option>
                        {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    {errors.branch && <p className="error-text">{errors.branch}</p>}
                </div>
            </div>


            <div className="btn-row">
                <button type="button" className="btn btn-secondary" onClick={onBack}>← Back</button>
                <button type="submit" className="btn btn-primary">Next Step →</button>
            </div>
        </form>
    )
}
