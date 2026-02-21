import React from 'react'
import styles from './ProfileHeader.module.css'

const ProfileHeader = () => {
  return (
    <section className={styles.card}>
      <div className={styles.avatar} aria-hidden="true">
        <span className={styles.initials}>AS</span>
      </div>
      <div className={styles.info}>
        <h1 className={styles.name}>Ankit Sharma</h1>
        <p className={styles.meta}>
          B.Tech CSE · 2025 · Roll No: 21CS123 · <span className={styles.verified}>Verified</span>
        </p>
      </div>
      <div className={styles.status}>
        <span className={styles.badge}>Profile Locked for season</span>
      </div>
    </section>
  )
}

export default ProfileHeader

