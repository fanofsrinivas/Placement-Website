import { useEffect, useState } from 'react';
import { api } from '../../context/AuthContext';
import styles from './Public.module.css';

const topCompanies = [
    'Google', 'Microsoft', 'Amazon', 'Goldman Sachs', 'JP Morgan',
    'TCS', 'Infosys', 'Wipro', 'Deloitte', 'KPMG',
    'Adobe', 'Oracle', 'Samsung', 'Qualcomm', 'Intel',
    'Flipkart', 'Uber', 'Swiggy', 'PhonePe', 'Razorpay',
    'HCL', 'Cognizant', 'Accenture', 'McKinsey', 'BCG',
    'Nvidia', 'ServiceNow', 'Cisco', 'VMware', 'Sprinklr',
];

const Recruiters = () => {
    const [recruiters, setRecruiters] = useState([]);

    useEffect(() => {
        api.get('/public/stats').then(res => {
            if (res.data.topRecruiters?.length > 0) {
                setRecruiters(res.data.topRecruiters);
            }
        }).catch(() => { });
    }, []);

    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
                <h2>Our Recruiters</h2>
                <p>Leading companies that recruit from NIT Warangal</p>
                <div className={styles.accent}></div>
            </div>

            <div className={styles.recruitersGrid}>
                {topCompanies.map((name) => (
                    <div key={name} className={styles.recruiterCard}>
                        {name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recruiters;
