import React from 'react'
import styles from './QuickApprovals.module.css'

const QuickApprovals = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Quick Approvals</h2>
      <p className={styles.text}>
        Approve or reject frequently occurring requests such as similar job posts or company
        registrations.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary}>
          Review Student Verifications
        </button>
        <button type="button" className={styles.secondary}>
          Review Job Posts
        </button>
      </div>
    </section>
  )
}

export default QuickApprovals

