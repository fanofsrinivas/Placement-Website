import React from 'react'
import styles from './ResumeSelector.module.css'

const ResumeSelector = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Select Resume</h2>
      <p className={styles.text}>Choose which resume you would like to submit for this role.</p>
      <div className={styles.options}>
        <label className={styles.option}>
          <input type="radio" name="resume" defaultChecked />
          <span>Resume_SDE.pdf (Active)</span>
        </label>
        <label className={styles.option}>
          <input type="radio" name="resume" />
          <span>Resume_Data.pdf</span>
        </label>
      </div>
    </section>
  )
}

export default ResumeSelector

