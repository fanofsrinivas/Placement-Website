import React from 'react'
import styles from './AnnouncementTicker.module.css'

const items = [
  'Google – Online Test scheduled on 12 Mar, 7:00 PM IST',
  'Deadline extended: Infosys Systems Engineer – Apply by 05 Mar, 11:59 PM',
  'Pre‑placement talk: TCS Digital – 08 Mar, 3:00 PM, Main Auditorium',
  'New drive: Adobe Internship (SDE) for 2026 batch – Registrations open',
]

const AnnouncementTicker = () => {
  return (
    <section className={styles.wrapper} aria-label="Placement announcements">
      <div className={styles.header}>
        <h2 className={styles.title}>News &amp; Updates</h2>
        <p className={styles.badge}>Live ticker</p>
      </div>
      <div className={styles.ticker}>
        <div className={styles.track}>
          {[...items, ...items].map((text, index) => (
            <div key={`${text}-${index}`} className={styles.item}>
              <span className={styles.dot} />
              <span className={styles.text}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AnnouncementTicker

