import React from 'react'
import styles from './RecentActivity.module.css'

const activities = [
  'Shortlisted for TCS Digital – Technical Interview scheduled',
  'Applied to Adobe Internship (SDE) – Under review',
  'Profile verified by Admin – CGPA and documents locked',
]

const RecentActivity = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Recent Activity</h2>
      <ul className={styles.list}>
        {activities.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export default RecentActivity

