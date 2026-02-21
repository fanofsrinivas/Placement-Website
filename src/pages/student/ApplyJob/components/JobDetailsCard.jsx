import React from 'react'
import styles from './JobDetailsCard.module.css'

const JobDetailsCard = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.company}>Google</h2>
      <p className={styles.role}>Software Engineer</p>
      <p className={styles.meta}>CTC: ₹ 28 LPA · Location: Bengaluru · Full‑time</p>
    </section>
  )
}

export default JobDetailsCard

