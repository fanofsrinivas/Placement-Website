import React from 'react'
import styles from './RecentApplicants.module.css'

const applicants = [
  { name: 'Ankit Sharma', role: 'Software Engineer', stage: 'Screening' },
  { name: 'Priya Singh', role: 'SDE Intern', stage: 'Online Test' },
]

const RecentApplicants = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Recent Applicants</h2>
      <ul className={styles.list}>
        {applicants.map((a) => (
          <li key={a.name} className={styles.item}>
            <div>
              <p className={styles.name}>{a.name}</p>
              <p className={styles.meta}>
                {a.role} · <span>{a.stage}</span>
              </p>
            </div>
            <button type="button" className={styles.action}>
              View Profile
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RecentApplicants

