import styles from './Public.module.css';

const facultyTeam = [
    // Patron
    {
        name: 'Prof. Bidyadhar Subudhi',
        designation: 'Director, NIT Warangal',
        role: 'Patron',
        department: 'Office of the Director',
        emoji: '🎓',
    },

    // Head CCPD
    {
        name: 'Prof. P Venkata Suresh',
        designation: 'Head of Centre for Career Planning & Development',
        role: 'Head, CCPD',
        department: 'Department of Chemical Engineering',
        phone: '94901 65357',
        email: 'taps@nitw.ac.in',
        emoji: '🧪',
    },

    // Coordinators
    {
        name: 'Prof. Praveen Kumar Bommineni',
        designation: 'Coordinator (Placements & Internships)',
        role: 'Coordinator',
        department: 'Department of Chemical Engineering',
        phone: '0870-2462649',
        email: 'praveen@nitw.ac.in',
        emoji: '🧪',
    },
    {
        name: 'Prof. Venkanna Udutalapally',
        designation: 'Coordinator (Industrial Tours)',
        role: 'Coordinator',
        department: 'Department of Computer Science and Engineering',
        phone: '+91-870-2462707',
        email: 'venkannau@nitw.ac.in',
        emoji: '💻',
    },
    {
        name: 'Prof. Onkar Perumal',
        designation: 'Coordinator (Pre-placement & Soft Skill Activities)',
        role: 'Coordinator',
        department: 'Department of Biotechnology',
        phone: '+91-870-2462882',
        email: 'popomal@nitw.ac.in',
        emoji: '🧬',
    },
    {
        name: 'Prof. Ramachandra Gopal P',
        designation: 'Coordinator (Pre-placement & Soft Skill Activities)',
        role: 'Coordinator',
        department: 'Department of Management Studies',
        phone: '+91-870-2462875',
        email: 'prcgopal@nitw.ac.in',
        emoji: '📊',
    },
    {
        name: 'Prof. Ramya Devi Bommasabina',
        designation: 'Coordinator (Pre-placement & Soft Skill Activities)',
        role: 'Coordinator',
        department: 'Department of Humanities and Social Sciences',
        phone: '+91-870-246',
        email: 'ramyadevi@nitw.ac.in',
        emoji: '📚',
    },

    // Advisory Team
    {
        name: 'Prof. S Srinivasa Rao',
        designation: 'Dean (R & AA), Professor',
        role: 'Advisory Team',
        department: 'Department of Electrical Engineering',
        phone: '9490085002',
        email: 'dean_iraa@nitw.ac.in',
        emoji: '⚡',
    },
    {
        name: 'Prof. K Kiran Kumar',
        designation: 'Dean (Student Welfare), Professor',
        role: 'Advisory Team',
        department: 'Department of Mechanical Engineering',
        phone: '9490085362',
        email: 'dean_sw@nitw.ac.in',
        emoji: '⚙️',
    },
    {
        name: 'Prof. P Hari Krishna',
        designation: 'Professor',
        role: 'Advisory Team',
        department: 'Department of Civil Engineering',
        phone: '+91-870-2462135',
        email: 'phari@nitw.ac.in',
        emoji: '🏗️',
    },
    {
        name: 'Prof. M. Joseph Davidson',
        designation: 'Professor',
        role: 'Advisory Team',
        department: 'Department of Mechanical Engineering',
        phone: '8332969324',
        email: 'jd@nitw.ac.in',
        emoji: '⚙️',
    },
    {
        name: 'Shri. Sunil Kumar Mehta',
        designation: 'Registrar',
        role: 'Advisory Team',
        department: 'Office of the Registrar',
        emoji: '🏛️',
    },

    // Departmental PICs
    {
        name: 'Prof. Surajbhan Sevda',
        designation: 'Assistant Professor',
        role: 'Departmental PIC',
        department: 'Department of Biotechnology',
        phone: '+91-870-2484208',
        email: 'sevdasuraj@nitw.ac.in',
        emoji: '🧬',
    },
    {
        name: 'Prof. K.S Raj Mohan',
        designation: 'Assistant Professor',
        role: 'Departmental PIC',
        department: 'Department of Chemical Engineering',
        phone: '+91-870-2482631',
        email: 'rajmohan@nitw.ac.in',
        emoji: '🧪',
    },
    {
        name: 'Prof. Jugun Prakash Chinta',
        designation: 'Assistant Professor',
        role: 'Departmental PIC',
        department: 'Department of Chemistry',
        phone: '+91-870-246',
        email: 'jugun@nitw.ac.in',
        emoji: '🔬',
    },
    {
        name: 'Prof. Gondu Venkata Ramana',
        designation: 'Assistant Professor',
        role: 'Departmental PIC',
        department: 'Department of Civil Engineering',
        phone: '+91-870-2482129',
        email: 'gvramana@nitw.ac.in',
        emoji: '🏗️',
    },
    {
        name: 'Prof. Venkateswara Rao Kagita',
        designation: 'Assistant Professor',
        role: 'Departmental PIC',
        department: 'Department of Computer Science and Engineering',
        phone: '+91-870-2484279',
        email: 'venkat.kagita@nitw.ac.in',
        emoji: '💻',
    },
    {
        name: 'Prof. Palash Mishra',
        designation: 'Assistant Professor',
        role: 'Departmental PIC',
        department: 'Department of Electrical Engineering',
        phone: '+91-870-2484248',
        email: 'pmishra@nitw.ac.in',
        emoji: '⚡',
    },
    {
        name: 'Prof. Kota Srinivas Reddy',
        designation: 'Assistant Professor',
        role: 'Departmental PIC',
        department: 'Department of Electronics and Communication Engineering',
        phone: '+91-870-2482429',
        email: 'ksreddy@nitw.ac.in',
        emoji: '📡',
    },
    {
        name: 'Prof. Aman Dua',
        designation: 'Assistant Professor',
        role: 'Departmental PIC',
        department: 'Department of Management Studies',
        phone: '9759134215',
        email: 'amandua@nitw.ac.in',
        emoji: '📊',
    },
    {
        name: 'Prof. Y Sreenivasarao',
        designation: 'Assistant Professor',
        role: 'Departmental PIC',
        department: 'Department of Mathematics',
        phone: '+91-870-2482635',
        email: 'ysr@nitw.ac.in',
        emoji: '📐',
    },
    {
        name: 'Prof. P Suresh',
        designation: 'Assistant Professor',
        role: 'Departmental PIC',
        department: 'Department of Mechanical Engineering',
        phone: '+91-870-246',
        email: 'sureshp@nitw.ac.in',
        emoji: '⚙️',
    },
    {
        name: 'Prof. Bharath Bandi',
        designation: 'Assistant Professor',
        role: 'Departmental PIC',
        department: 'Department of Metallurgical and Materials Engineering',
        phone: '+91-870-246',
        email: 'bharathb@nitw.ac.in',
        emoji: '🔩',
    },
    {
        name: 'Prof. V Jayalakshmi',
        designation: 'Associate Professor',
        role: 'Departmental PIC',
        department: 'Department of Physics',
        phone: '+91-870-2482593',
        email: 'jayalakshmi@nitw.ac.in',
        emoji: '⚛️',
    },

    // Training & Placement Officer
    {
        name: 'Shri. Sudhir Chandra',
        designation: 'Training & Placement Officer',
        role: 'T&P Officer (On Contract)',
        department: 'CCPD',
        emoji: '📋',
    },

    // Office Staff
    {
        name: 'Shri. N. Kishore Kumar',
        designation: 'Jr. Assistant',
        role: 'Office Staff',
        department: 'CCPD',
        phone: '8332969508',
        email: 'nkkishore@nitw.ac.in',
        emoji: '🗂️',
    },
];
const studentCoordinators = [
    { name: 'Eedammagari Harish Reddy', role: '', branch: '', year: '' },
    { name: 'srinivas', role: '', branch: '', year: '' },
    { name: 'sandy', role: '', branch: '', year: '' },
    { name: 'Hemanth Chanda', role: '', branch: '', year: '' },
    { name: 'Keshav Raj', role: '', branch: '', year: '' },
    { name: 'Kundan Verma', role: '', branch: '', year: '' },
    { name: 'Manasa Kotam', role: '', branch: '', year: '' },
    { name: 'debarka', role: '', branch: '', year: '' },
    { name: 'Nandini Ranga', role: '', branch: '', year: '' },
];

const departmentReps = [
    { branch: 'CSE', rep: 'karthik kole ' },
    { branch: 'ECE', rep: 'Harsha' },
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
