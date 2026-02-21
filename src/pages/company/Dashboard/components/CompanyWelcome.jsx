import React from 'react'
import styles from './CompanyWelcome.module.css'

const CompanyWelcome = () => {
  return (
    <section className={styles.card}>
      <div>
        <p className={styles.kicker}>Recruiter Dashboard</p>
        <h1 className={styles.heading}>Welcome, Google India Pvt. Ltd.</h1>
        <p className={styles.text}>
          Your recruiter profile is currently <span className={styles.approved}>Approved</span>.
          You can now post jobs, track candidates and schedule interviews.
        </p>
      </div>
    </section>
  )
}

export default CompanyWelcome

