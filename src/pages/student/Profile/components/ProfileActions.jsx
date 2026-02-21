import React from 'react'
import styles from './ProfileActions.module.css'

const ProfileActions = () => {
  return (
    <section className={styles.card}>
      <p className={styles.text}>
        During an active recruitment season, critical fields such as CGPA and backlogs are locked.
        Use the correction request if you need to update verified information.
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.secondary}>
          Save Draft
        </button>
        <button type="button" className={styles.primary}>
          Request Correction
        </button>
      </div>
    </section>
  )
}

export default ProfileActions

