import React from 'react'
import styles from './EligibilityCheck.module.css'

const EligibilityCheck = () => {
  return (
    <section className={styles.card}>
      <p className={styles.status}>You are eligible for this drive.</p>
      <p className={styles.reason}>
        CGPA: 8.4 ≥ 8.0 · No active backlogs · Branch: CSE (Allowed) · Batch: 2025 (Eligible)
      </p>
    </section>
  )
}

export default EligibilityCheck

