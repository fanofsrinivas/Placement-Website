import styles from './Public.module.css';

const facultyTeam = [
    {
        name: 'Dr. N.V. Ramana Rao',
        designation: 'Director, NIT Warangal',
        role: 'Patron',
        department: 'Office of the Director',
        emoji: '🎓',
    },
    {
        name: 'Dr. S. Srinivasa Rao',
        designation: 'Professor & Dean (Student Welfare)',
        role: 'Chief Placement Advisor',
        department: 'Department of Mechanical Engineering',
        emoji: '👨‍🏫',
    },
    {
        name: 'Dr. K. Shivaprakash',
        designation: 'Professor & Faculty Advisor (T&P)',
        role: 'Head, CCPD',
        department: 'Department of ECE',
        emoji: '📡',
    },
    {
        name: 'Dr. P. Ravi Kumar',
        designation: 'Associate Professor',
        role: 'Deputy Faculty Advisor (T&P)',
        department: 'Department of CSE',
        emoji: '💻',
    },
    {
        name: 'Dr. M. Srinivas',
        designation: 'Assistant Professor',
        role: 'Faculty Coordinator (Internships)',
        department: 'Department of EEE',
        emoji: '⚡',
    },
    {
        name: 'Dr. A. Vani Lakshmi',
        designation: 'Assistant Professor',
        role: 'Faculty Coordinator (Industry Relations)',
        department: 'Department of Civil Engineering',
        emoji: '🏗️',
    },
];

const studentCoordinators = [
    { name: 'Rahul Sharma', role: 'Overall Placement Coordinator', branch: 'CSE', year: 'Final Year B.Tech' },
    { name: 'Priya Reddy', role: 'Overall Placement Coordinator', branch: 'ECE', year: 'Final Year B.Tech' },
    { name: 'Aditya Kumar', role: 'Technical Coordinator', branch: 'CSE', year: 'Final Year B.Tech' },
    { name: 'Sneha Patel', role: 'Industry Relations Lead', branch: 'ME', year: 'Final Year B.Tech' },
    { name: 'Vikram Singh', role: 'Data & Analytics Lead', branch: 'CSE', year: 'Pre-Final Year B.Tech' },
    { name: 'Ananya Gupta', role: 'Events & Logistics Coordinator', branch: 'EEE', year: 'Pre-Final Year B.Tech' },
    { name: 'Karthik Nair', role: 'Social Media & Outreach', branch: 'ECE', year: 'Pre-Final Year B.Tech' },
    { name: 'Deepa Joshi', role: 'Student Welfare Coordinator', branch: 'CE', year: 'Final Year B.Tech' },
];

const departmentReps = [
    { branch: 'CSE', rep: 'Arjun Menon' },
    { branch: 'ECE', rep: 'Kavitha Rao' },
    { branch: 'EEE', rep: 'Sanjay Verma' },
    { branch: 'ME', rep: 'Pooja Deshmukh' },
    { branch: 'CE', rep: 'Ravi Teja' },
    { branch: 'CHE', rep: 'Meera Krishnan' },
    { branch: 'MME', rep: 'Abhishek Das' },
    { branch: 'BT', rep: 'Nandini Agarwal' },
    { branch: 'MCA', rep: 'Suresh Babu' },
    { branch: 'M.Tech (Various)', rep: 'Lakshmi Prasad' },
];

const AboutTPO = () => {
    return (
        <div>
            {/* Hero section */}
            <div className={styles.hero} style={{ padding: '60px 0' }}>
                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>Est. 1959</div>
                    <h1 className={styles.heroTitle}>
                        Centre for Career Planning<br />& <span>Development</span>
                    </h1>
                    <p className={styles.heroDesc}>
                        NIT Warangal's dedicated placement cell — connecting talent with opportunity for over six decades.
                    </p>
                </div>
            </div>

            <div className={styles.section}>
                <div className={styles.aboutContent}>
                    <p>
                        The Centre for Career Planning & Development (CCPD) at NIT Warangal, formerly known as the
                        Training and Placement Office, has been instrumental in bridging the gap between academia and
                        industry for over six decades. Established as one of the premier NITs in India, NIT Warangal
                        has been a consistent destination for top recruiters worldwide.
                    </p>

                    <div className={styles.aboutStats}>
                        <div className={styles.aboutStat}>
                            <h3>60+</h3>
                            <p>Years of Excellence</p>
                        </div>
                        <div className={styles.aboutStat}>
                            <h3>200+</h3>
                            <p>Companies Visit Annually</p>
                        </div>
                        <div className={styles.aboutStat}>
                            <h3>95%</h3>
                            <p>Average Placement Rate</p>
                        </div>
                    </div>

                    <h2>Our Mission</h2>
                    <p>
                        To facilitate holistic career planning and seamless placement processes for all students,
                        ensuring they find roles aligned with their aspirations and capabilities. We aim to build
                        lasting industry-academia partnerships.
                    </p>

                    <h2>Our Vision</h2>
                    <p>
                        To be the most sought-after destination for top recruiters globally, known for producing
                        innovative, skilled, and industry-ready professionals who contribute meaningfully to society.
                    </p>

                    <h2>What We Do</h2>
                    <p>
                        The CCPD manages internships, campus placements, and career development programs.
                        We organize pre-placement talks, mock interviews, resume workshops, and soft-skill
                        training sessions. Our team coordinates with 200+ companies every year to ensure
                        a smooth recruitment process.
                    </p>
                </div>
            </div>

            {/* Faculty Team */}
            <div className={styles.section} style={{ background: '#f0f1f6' }}>
                <div className={styles.sectionTitle}>
                    <h2>Faculty Team</h2>
                    <p>The guiding force behind CCPD's success</p>
                    <div className={styles.accent}></div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 20,
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: '0 20px',
                }}>
                    {facultyTeam.map((member) => (
                        <div key={member.name} style={{
                            background: '#fff',
                            borderRadius: 12,
                            padding: 24,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            display: 'flex',
                            gap: 16,
                            alignItems: 'flex-start',
                            transition: 'all 0.3s ease',
                        }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 14,
                                background: 'linear-gradient(135deg, #e8eaf6, #c5cae9)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 28, flexShrink: 0,
                            }}>
                                {member.emoji}
                            </div>
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>
                                    {member.name}
                                </h3>
                                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                    {member.designation}
                                </p>
                                <span className="badge badge-primary" style={{ marginTop: 6 }}>
                                    {member.role}
                                </span>
                                <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>
                                    {member.department}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Student Coordinators */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <h2>Student Placement Team</h2>
                    <p>Dedicated student coordinators who manage the end-to-end placement process</p>
                    <div className={styles.accent}></div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 20,
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: '0 20px',
                }}>
                    {studentCoordinators.map((coord) => (
                        <div key={coord.name} style={{
                            background: '#fff',
                            borderRadius: 12,
                            padding: 20,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            borderLeft: '4px solid var(--primary)',
                            transition: 'all 0.3s ease',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{coord.name}</h3>
                                    <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>{coord.role}</p>
                                </div>
                                <span className="badge badge-info">{coord.branch}</span>
                            </div>
                            <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 8 }}>{coord.year}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Department Representatives */}
            <div className={styles.section} style={{ background: '#f0f1f6' }}>
                <div className={styles.sectionTitle}>
                    <h2>Department Representatives</h2>
                    <p>Branch-level coordinators ensuring every student is supported</p>
                    <div className={styles.accent}></div>
                </div>

                <div className="table-container" style={{ maxWidth: 700, margin: '0 auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Department</th>
                                <th>Student Representative</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departmentReps.map((rep) => (
                                <tr key={rep.branch}>
                                    <td>
                                        <span className="badge badge-primary">{rep.branch}</span>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{rep.rep}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AboutTPO;
