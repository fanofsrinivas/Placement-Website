import React from 'react'
import styles from './UpcomingInterviews.module.css'

const interviews = [
  { slot: '10:00 AM', role: 'Software Engineer', count: 3 },
  { slot: '2:30 PM', role: 'SDE Intern', count: 5 },
]

const UpcomingInterviews = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Upcoming Interviews</h2>
      <ul className={styles.list}>
        {interviews.map((i) => (
          <li key={i.slot} className={styles.item}>
            <div>
              <p className={styles.slot}>{i.slot}</p>
              <p className={styles.meta}>
                {i.role} · {i.count} candidates
              </p>
            </div>
            <button type="button" className={styles.action}>
              View Slots
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default UpcomingInterviews

