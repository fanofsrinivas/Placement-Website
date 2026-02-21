import React from 'react'
import styles from './CompanyCredentials.module.css'

const CompanyCredentials = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Login Credentials</h2>
      <p className={styles.subtitle}>
        These credentials will be used to access the recruiter dashboard once approved by Admin.
      </p>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="loginEmail">Login Email</label>
          <input id="loginEmail" type="email" placeholder="company.placements@company.com" />
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Create a strong password" />
        </div>
        <div className={styles.field}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input id="confirmPassword" type="password" placeholder="Re‑enter password" />
        </div>
      </div>
      <div className={styles.footer}>
        <p className={styles.note}>
          By submitting this form, you acknowledge that all details provided are accurate. The T&amp;P
          Cell may contact you for any clarification before approval.
        </p>
        <button type="button" className={styles.submit}>
          Submit for Admin Approval
        </button>
      </div>
    </section>
  )
}

export default CompanyCredentials

