import React from 'react'
import styles from './SubmitApplication.module.css'

const SubmitApplication = () => {
  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.button}>
        Submit Application
      </button>
      <p className={styles.note}>
        On submission, your application status will move to <strong>HR Review</strong> in your
        dashboard.
      </p>
    </div>
  )
}

export default SubmitApplication

