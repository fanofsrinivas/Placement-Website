import React from 'react'
import styles from './SystemStats.module.css'

const stats = [
  { label: 'Total Users', value: '4,320' },
  { label: 'Active Students', value: '2,850' },
  { label: 'Registered Companies', value: '120' },
  { label: 'Pending Approvals', value: '24' },
]

const SystemStats = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>System Overview</h2>
      <div className={styles.grid}>
        {stats.map((s) => (
          <div key={s.label} className={styles.item}>
            <p className={styles.value}>{s.value}</p>
            <p className={styles.label}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SystemStats

