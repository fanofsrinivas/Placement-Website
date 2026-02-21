import React from 'react'
import styles from './Deadlines.module.css'

const deadlines = [
  { company: 'Google', date: '05 Mar', label: 'Applications close' },
  { company: 'TCS Digital', date: '08 Mar', label: 'Online test' },
  { company: 'Adobe', date: '10 Mar', label: 'PPT & Registration' },
]

const Deadlines = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Upcoming Deadlines</h2>
      <ul className={styles.list}>
        {deadlines.map((item) => (
          <li key={item.company} className={styles.item}>
            <div className={styles.date}>
              <span>{item.date}</span>
            </div>
            <div className={styles.info}>
              <p className={styles.company}>{item.company}</p>
              <p className={styles.label}>{item.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Deadlines

