import React from 'react'
import styles from './FacultyTeam.module.css'

const faculty = [
  {
    name: 'Dr. A. Sharma',
    designation: 'Professor & Faculty Coordinator',
    department: 'Computer Science & Engineering',
    email: 'asharma@college.edu',
  },
  {
    name: 'Dr. B. Rao',
    designation: 'Associate Professor & Faculty Coordinator',
    department: 'Electronics & Communication',
    email: 'brao@college.edu',
  },
]

const FacultyTeam = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>Faculty Coordinators</h2>
        <p className={styles.subtitle}>
          Experienced faculty members overseeing the end‑to‑end placement process.
        </p>
      </header>
      <div className={styles.grid}>
        {faculty.map((member) => (
          <article key={member.email} className={styles.card}>
            <p className={styles.name}>{member.name}</p>
            <p className={styles.designation}>{member.designation}</p>
            <p className={styles.department}>{member.department}</p>
            <p className={styles.email}>{member.email}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FacultyTeam

