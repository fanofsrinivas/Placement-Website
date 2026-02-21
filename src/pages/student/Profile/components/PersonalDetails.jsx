import React from 'react'
import styles from './PersonalDetails.module.css'

const PersonalDetails = () => {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>Personal Details</h2>
      </header>
      <div className={styles.grid}>
        <div className={styles.field}>
          <span className={styles.label}>Email (Official)</span>
          <span className={styles.value}>ankit.sharma@college.edu</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Email (Personal)</span>
          <span className={styles.value}>ankit.sharma@gmail.com</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Mobile</span>
          <span className={styles.value}>+91‑98765 43210</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Date of Birth</span>
          <span className={styles.value}>12 Jan 2004</span>
        </div>
        <div className={styles.fullField}>
          <span className={styles.label}>Address</span>
          <span className={styles.value}>#12, Street Name, City, State, PIN</span>
        </div>
      </div>
    </section>
  )
}

export default PersonalDetails

