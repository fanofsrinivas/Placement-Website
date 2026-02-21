import React from 'react'
import styles from './StudentStats.module.css'

const cards = [
  { label: 'Applied', value: 5 },
  { label: 'Shortlisted', value: 2 },
  { label: 'Interviews', value: 1 },
  { label: 'Offers', value: 0 },
]

const StudentStats = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Application Funnel</h2>
      <div className={styles.grid}>
        {cards.map((c) => (
          <div key={c.label} className={styles.item}>
            <p className={styles.value}>{c.value}</p>
            <p className={styles.label}>{c.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StudentStats

