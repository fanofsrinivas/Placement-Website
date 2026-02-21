import React from 'react'
import styles from './ProfileStrength.module.css'

const ProfileStrength = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Profile Strength</h2>
      <p className={styles.caption}>Complete your profile to unlock all eligible companies.</p>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} />
      </div>
      <p className={styles.status}>92% complete · Resume and 10th marksheet verified</p>
      <ul className={styles.list}>
        <li>✓ Personal details</li>
        <li>✓ Education history</li>
        <li>✓ Active resume</li>
        <li>• Pending: Internship details</li>
      </ul>
    </section>
  )
}

export default ProfileStrength

