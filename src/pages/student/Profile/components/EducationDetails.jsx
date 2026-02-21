import React from 'react'
import styles from './EducationDetails.module.css'

const EducationDetails = () => {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>Education</h2>
      </header>
      <div className={styles.list}>
        <article className={styles.item}>
          <p className={styles.degree}>B.Tech in Computer Science &amp; Engineering</p>
          <p className={styles.meta}>2021 – 2025 · Current CGPA: 8.4 · No active backlogs</p>
        </article>
        <article className={styles.item}>
          <p className={styles.degree}>12th · CBSE</p>
          <p className={styles.meta}>Year of Passing: 2021 · 92%</p>
        </article>
        <article className={styles.item}>
          <p className={styles.degree}>10th · CBSE</p>
          <p className={styles.meta}>Year of Passing: 2019 · 93%</p>
        </article>
      </div>
    </section>
  )
}

export default EducationDetails

