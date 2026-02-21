import React from 'react'
import styles from './CompanyStats.module.css'

const stats = [
  { label: 'Active Jobs', value: 3 },
  { label: 'Total Applications', value: 120 },
  { label: 'Shortlisted Today', value: 8 },
  { label: 'Interviews Today', value: 4 },
]

const CompanyStats = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Today&apos;s Snapshot</h2>
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

export default CompanyStats

