import React from 'react'
import styles from './PendingQueue.module.css'

const items = [
  { label: 'Student Verifications', count: 10 },
  { label: 'Company Approvals', count: 6 },
  { label: 'Job Posts', count: 8 },
]

const PendingQueue = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Pending Queue</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.label} className={styles.item}>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.count}>{item.count}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PendingQueue

