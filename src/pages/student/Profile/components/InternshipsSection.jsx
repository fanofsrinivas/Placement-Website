import React from 'react'
import styles from './InternshipsSection.module.css'

const InternshipsSection = () => {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>Internships</h2>
      </header>
      <div className={styles.list}>
        <article className={styles.item}>
          <p className={styles.name}>Backend Intern · FinTech Startup</p>
          <p className={styles.meta}>Jun 2024 – Aug 2024 · Node.js · PostgreSQL</p>
          <p className={styles.desc}>
            Implemented REST APIs and optimised database queries, improving response times by 30%.
          </p>
        </article>
      </div>
    </section>
  )
}

export default InternshipsSection

