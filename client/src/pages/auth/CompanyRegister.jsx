import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import styles from '../public/Public.module.css';

const CompanyRegister = () => {
    const [form, setForm] = useState({
        email: '', password: '', confirmPassword: '',
        companyName: '', website: '', linkedIn: '',
        industry: '', hrName: '', hrPhone: '',
    });
    const [loading, setLoading] = useState(false);
    const { registerCompany } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        if (form.password.length < 8) {
            toast.error('Password must be at least 8 characters.');
            return false;
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match.');
            return false;
        }
        if (!form.website) {
            toast.error('Company website is required.');
            return false;
        }
        if (!form.linkedIn) {
            toast.error('Company LinkedIn profile is required.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await registerCompany(form);
            toast.success('Registration successful! Awaiting admin verification.');
            navigate('/company/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard} style={{ maxWidth: 520 }}>
                <h1>Company Registration</h1>
                <p className={styles.subtitle}>Register to recruit from NIT Warangal</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="comp-name">Company Name *</label>
                        <input id="comp-name" required value={form.companyName} onChange={set('companyName')} placeholder="Your Company Name" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comp-email">Official Email *</label>
                        <input id="comp-email" type="email" required value={form.email} onChange={set('email')} placeholder="hr@company.com" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comp-website">Company Website *</label>
                        <input id="comp-website" type="url" required value={form.website} onChange={set('website')} placeholder="https://www.company.com" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comp-linkedin">Company LinkedIn *</label>
                        <input id="comp-linkedin" type="url" required value={form.linkedIn} onChange={set('linkedIn')} placeholder="https://linkedin.com/company/..." />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comp-industry">Industry</label>
                        <select id="comp-industry" value={form.industry} onChange={set('industry')}>
                            <option value="">Select Industry</option>
                            <option value="IT/Software">IT/Software</option>
                            <option value="Finance/Banking">Finance/Banking</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="E-Commerce">E-Commerce</option>
                            <option value="EdTech">EdTech</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group">
                            <label htmlFor="comp-hr">HR Contact Name *</label>
                            <input id="comp-hr" required value={form.hrName} onChange={set('hrName')} placeholder="HR Name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="comp-hrphone">HR Phone *</label>
                            <input id="comp-hrphone" required value={form.hrPhone} onChange={set('hrPhone')} placeholder="+91-XXXXXXXXXX" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="comp-password">Password *</label>
                        <input id="comp-password" type="password" required value={form.password} onChange={set('password')} placeholder="Min 8 characters" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comp-confirm">Confirm Password *</label>
                        <input id="comp-confirm" type="password" required value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Re-enter password" />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Registering...' : 'Register Company'}
                    </button>
                </form>

                <div className={styles.authLinks}>
                    <p>Already registered? <Link to="/login">Sign In</Link></p>
                    <p>Are you a student? <Link to="/register/student">Student Register</Link></p>
                </div>
            </div>
        </div>
    );
};

export default CompanyRegister;
