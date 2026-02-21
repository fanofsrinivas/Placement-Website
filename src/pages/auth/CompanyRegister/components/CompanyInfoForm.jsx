import React from 'react'
import styles from './CompanyInfoForm.module.css'

const CompanyInfoForm = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Company Information</h2>
      <p className={styles.subtitle}>
        Basic details that help us identify and profile your organisation for campus engagements.
      </p>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="companyName">Company Name</label>
          <input id="companyName" type="text" placeholder="e.g. Acme Technologies Pvt. Ltd." />
        </div>
        <div className={styles.field}>
          <label htmlFor="website">Website</label>
          <input id="website" type="url" placeholder="https://example.com" />
        </div>
        <div className={styles.field}>
          <label htmlFor="linkedin">LinkedIn Profile</label>
          <input id="linkedin" type="url" placeholder="https://linkedin.com/company/..." />
        </div>
        <div className={styles.field}>
          <label htmlFor="sector">Industry Sector</label>
          <input id="sector" type="text" placeholder="e.g. Product, Services, Analytics" />
        </div>
      </div>
    </section>
  )
}

export default CompanyInfoForm

