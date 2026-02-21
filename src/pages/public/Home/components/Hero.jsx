import React from 'react'
import styles from './Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <p className={styles.badge}>Central Placement Portal · 2025–26 Season</p>
        <h1 className={styles.heading}>
          Connecting <span className={styles.highlight}>Students</span> with
          world‑class <span className={styles.highlight}>Opportunities</span>.
        </h1>
        <p className={styles.subheading}>
          A single window platform for students, recruiters and the Training &amp; Placement Cell
          to manage the complete campus hiring lifecycle in a transparent way.
        </p>
        <div className={styles.actions}>
          <button type="button" className={styles.primary}>
            View Active Drives
          </button>
          <button type="button" className={styles.secondary}>
            Explore Placement Stats
          </button>
        </div>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>4 user roles</span>
            <span className={styles.metaValue}>Students · Companies · TPO · Admin</span>
          </div>
          <div className={styles.metaDivider} />
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Real‑time updates</span>
            <span className={styles.metaValue}>Drives, tests, interviews &amp; offers</span>
          </div>
        </div>
      </div>
      <div className={styles.visual}>
        <div className={styles.glassCard}>
          <p className={styles.cardTitle}>Placement Snapshot · 2024‑25</p>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Total Offers</span>
              <span className={styles.statValue}>320+</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Highest CTC</span>
              <span className={styles.statValue}>₹ 28 LPA</span>
            </div>
          </div>
          <div className={styles.progressBlock}>
            <div className={styles.progressHeader}>
              <span>Overall Placement</span>
              <span className={styles.progressValue}>86%</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} />
            </div>
            <p className={styles.progressCaption}>CS · IT · ECE · Mechanical · Civil</p>
          </div>
        </div>
        <div className={styles.accentGlow} />
      </div>
    </section>
  )
}

export default Hero

