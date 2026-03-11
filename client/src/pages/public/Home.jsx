import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../context/AuthContext';
import styles from './Public.module.css';

const Home = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/public/stats').then(res => setStats(res.data)).catch(() => { });
    }, []);

    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>🎓 NIT Warangal — Established 1959</div>
                    <h1 className={styles.heroTitle}>
                        Centre for Career<br />Planning & <span>Development</span>
                    </h1>
                    <p className={styles.heroDesc}>
                        Bridging the gap between academia and industry. We connect talented students
                        from NIT Warangal with top companies across India and the globe.
                    </p>
                    <div className={styles.heroBtns}>
                        <Link to="/register/student" className="btn btn-secondary btn-lg">
                            Student Register
                        </Link>
                        <Link to="/register/company" className="btn btn-outline btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>
                            Recruit from NITW
                        </Link>
                    </div>

                    <div className={styles.heroStats}>
                        <div className={styles.heroStat}>
                            <h3>{stats?.placedStudents || '500'}+</h3>
                            <p>Students Placed</p>
                        </div>
                        <div className={styles.heroStat}>
                            <h3>{stats?.totalCompanies || '150'}+</h3>
                            <p>Recruiting Companies</p>
                        </div>
                        <div className={styles.heroStat}>
                            <h3>{stats?.maxPackage ? `${stats.maxPackage}` : '60'}</h3>
                            <p>Highest Package (LPA)</p>
                        </div>
                        <div className={styles.heroStat}>
                            <h3>{stats?.placementRate || '90'}%</h3>
                            <p>Placement Rate</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionTitle}>
                    <h2>Why Choose NITW?</h2>
                    <p>Consistently ranked among top engineering institutions in India</p>
                    <div className={styles.accent}></div>
                </div>
                <div className={styles.features}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🎯</div>
                        <h3>Industry-Ready Talent</h3>
                        <p>Our rigorous curriculum and industry partnerships ensure students are job-ready from day one.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🤝</div>
                        <h3>Dedicated Placement Cell</h3>
                        <p>A full-time team of professionals managing end-to-end placement processes and company relations.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📊</div>
                        <h3>Transparent Process</h3>
                        <p>Digital-first approach with real-time tracking of applications, interviews, and offers.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🌍</div>
                        <h3>Global Recruiters</h3>
                        <p>Top MNCs and startups from across the globe recruit from our campus every year.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>💡</div>
                        <h3>Diverse Programs</h3>
                        <p>B.Tech, M.Tech, MSc, MCA, PhD — talent across engineering, sciences, and management.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🏆</div>
                        <h3>NIRF Top 20</h3>
                        <p>Consistently ranked among India's top 20 engineering institutions by NIRF.</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
