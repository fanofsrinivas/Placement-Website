import React from 'react'
import styles from './AdminActivity.module.css'

const activities = [
  'Verified 42 student profiles for 2025 batch',
  'Approved job post: Software Engineer – Google',
  'Rejected company registration: XYZ Corp (insufficient details)',
]

const AdminActivity = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Recent Activity</h2>
      <ul className={styles.list}>
        {activities.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </section>
  )
}

export default AdminActivity

