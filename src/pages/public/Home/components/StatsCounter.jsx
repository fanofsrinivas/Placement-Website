import React from 'react'
import styles from './StatsCounter.module.css'

const StatsCounter = () => {
  const stats = [
    { label: 'Eligible Students', value: '850+', caption: 'Actively looking for opportunities' },
    { label: 'Programs & Branches', value: '20+', caption: 'Engineering · Management · Others' },
    { label: 'Annual Drives', value: '60+', caption: 'On‑campus & virtual recruitment' },
    { label: 'Recruiting Partners', value: '120+', caption: 'Product · Services · Startups' },
  ]

  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>Recruitment Snapshot</h2>
        <p className={styles.subtitle}>
          Key numbers to help you plan your hiring strategy on campus this season.
        </p>
      </header>
      <div className={styles.grid}>
        {stats.map((item) => (
          <article key={item.label} className={styles.card}>
            <p className={styles.label}>{item.label}</p>
            <p className={styles.value}>{item.value}</p>
            <p className={styles.caption}>{item.caption}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default StatsCounter

