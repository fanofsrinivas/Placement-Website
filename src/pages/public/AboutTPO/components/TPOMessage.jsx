import React from 'react'
import styles from './TPOMessage.module.css'

const TPOMessage = () => {
  return (
    <section className={styles.section}>
      <div className={styles.photo} aria-hidden="true">
        <div className={styles.initials}>TP</div>
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>Message from the Training &amp; Placement Officer</h2>
        <p className={styles.text}>
          Our commitment is to ensure that every eligible student receives the right guidance,
          opportunity and support throughout the placement season. This platform has been designed
          to bring transparency, efficiency and fairness to the entire recruitment process.
        </p>
        <p className={styles.text}>
          We actively collaborate with industry partners to align our students’ skills with current
          market expectations while upholding the highest standards of ethics and professionalism in
          every engagement.
        </p>
        <p className={styles.meta}>Dr. Name Surname · Training &amp; Placement Officer</p>
      </div>
    </section>
  )
}

export default TPOMessage

