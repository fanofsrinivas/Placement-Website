import React from 'react'
import styles from './MissionVision.module.css'

const MissionVision = () => {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.title}>Our Mission</h2>
        <p className={styles.text}>
          To empower students with the right skills, exposure and guidance so that they can secure
          meaningful roles in leading organisations across the globe.
        </p>
      </div>
      <div className={styles.card}>
        <h2 className={styles.title}>Our Vision</h2>
        <p className={styles.text}>
          To build a highly transparent, data‑driven and student‑centric placement ecosystem that
          consistently achieves best‑in‑class outcomes for every graduating batch.
        </p>
      </div>
    </section>
  )
}

export default MissionVision

