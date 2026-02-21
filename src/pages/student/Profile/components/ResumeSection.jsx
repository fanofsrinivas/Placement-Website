import React from 'react'
import styles from './ResumeSection.module.css'

const ResumeSection = () => {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>Resume</h2>
      </header>
      <div className={styles.content}>
        <p className={styles.text}>
          You can upload up to three resumes and mark one as active while applying to companies.
        </p>
        <button type="button" className={styles.primary}>
          Upload New Resume
        </button>
        <ul className={styles.list}>
          <li>
            <span className={styles.resumeName}>Resume_SDE.pdf</span>
            <span className={styles.tag}>Active</span>
          </li>
          <li>
            <span className={styles.resumeName}>Resume_Data.pdf</span>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default ResumeSection

