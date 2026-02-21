import React from 'react'
import styles from './QuickActions.module.css'

const QuickActions = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Quick Actions</h2>
      <div className={styles.grid}>
        <button type="button" className={styles.actionPrimary}>
          Post New Job
        </button>
        <button type="button" className={styles.action}>
          View Candidate Pipeline
        </button>
        <button type="button" className={styles.action}>
          Open Interview Scheduler
        </button>
      </div>
    </section>
  )
}

export default QuickActions

