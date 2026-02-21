import React from 'react'
import styles from './ContactInfoForm.module.css'

const ContactInfoForm = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Primary Contact</h2>
      <p className={styles.subtitle}>
        Details of the HR / Campus SPOC who will coordinate with the placement cell.
      </p>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="hrName">HR / Contact Person</label>
          <input id="hrName" type="text" placeholder="Full name" />
        </div>
        <div className={styles.field}>
          <label htmlFor="hrEmail">Official Email</label>
          <input id="hrEmail" type="email" placeholder="name@company.com" />
        </div>
        <div className={styles.field}>
          <label htmlFor="hrPhone">Contact Number</label>
          <input id="hrPhone" type="tel" placeholder="+91‑00000 00000" />
        </div>
        <div className={styles.field}>
          <label htmlFor="designation">Designation</label>
          <input id="designation" type="text" placeholder="e.g. Senior HR Manager" />
        </div>
      </div>
    </section>
  )
}

export default ContactInfoForm

