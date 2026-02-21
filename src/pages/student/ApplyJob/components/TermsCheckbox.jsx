import React from 'react'
import styles from './TermsCheckbox.module.css'

const TermsCheckbox = () => {
  return (
    <section className={styles.card}>
      <label className={styles.label}>
        <input type="checkbox" />
        <span>
          I confirm that the information provided is correct and I meet the eligibility criteria for
          this drive.
        </span>
      </label>
    </section>
  )
}

export default TermsCheckbox

