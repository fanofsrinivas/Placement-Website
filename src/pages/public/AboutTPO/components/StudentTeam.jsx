import React from 'react'
import styles from './StudentTeam.module.css'

const students = [
  {
    name: 'Rohan Mehta',
    role: 'Student Placement Coordinator',
    branch: 'B.Tech CSE · 2025',
    email: 'rohan.mehta@college.edu',
  },
  {
    name: 'Priya Singh',
    role: 'Student Placement Coordinator',
    branch: 'B.Tech ECE · 2025',
    email: 'priya.singh@college.edu',
  },
  {
    name: 'Arjun Patel',
    role: 'Student Volunteer',
    branch: 'MBA · 2024',
    email: 'arjun.patel@college.edu',
  },
]

const StudentTeam = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>Student Coordinators</h2>
        <p className={styles.subtitle}>
          The placement committee that drives on‑ground execution during the recruitment season.
        </p>
      </header>
      <div className={styles.grid}>
        {students.map((member) => (
          <article key={member.email} className={styles.card}>
            <p className={styles.name}>{member.name}</p>
            <p className={styles.role}>{member.role}</p>
            <p className={styles.branch}>{member.branch}</p>
            <p className={styles.email}>{member.email}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default StudentTeam

