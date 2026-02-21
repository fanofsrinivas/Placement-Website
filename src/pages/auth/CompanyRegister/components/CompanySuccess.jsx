import React from 'react'
import styles from './CompanySuccess.module.css'

const CompanySuccess = () => {
  return (
    <aside className={styles.card}>
      <p className={styles.kicker}>What happens next?</p>
      <h2 className={styles.title}>Awaiting Admin Approval</h2>
      <p className={styles.text}>
        Once you submit the registration form, the Admin / T&amp;P Cell verifies your organisation
        details, website and LinkedIn profile. You will receive an email as soon as your account is
        approved.
      </p>
      <ul className={styles.list}>
        <li>Review by Admin / T&amp;P Cell</li>
        <li>Approval email with login instructions</li>
        <li>Access to dashboard, job posting and candidate pipeline</li>
      </ul>
      <p className={styles.note}>
        Need assistance? Reach out to the placement office at{' '}
        <span className={styles.highlight}>tpo@college.edu</span>.
      </p>
    </aside>
  )
}

export default CompanySuccess

