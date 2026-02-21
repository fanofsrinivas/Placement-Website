import React from 'react'
import styles from './AdditionalInfo.module.css'

const AdditionalInfo = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Additional Information</h2>
      <p className={styles.text}>Optional cover note or role‑specific information.</p>
      <textarea
        className={styles.textarea}
        rows={4}
        placeholder="Briefly mention why you are a good fit for this role..."
      />
    </section>
  )
}

export default AdditionalInfo

