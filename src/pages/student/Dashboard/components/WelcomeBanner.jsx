import React from 'react'
import styles from './WelcomeBanner.module.css'

const WelcomeBanner = () => {
  return (
    <section className={styles.card}>
      <div>
        <p className={styles.kicker}>Student Command Centre</p>
        <h1 className={styles.heading}>Welcome back, Ankit.</h1>
        <p className={styles.text}>
          Your profile is 92% complete. You are currently eligible for{' '}
          <span className={styles.highlight}>7 active drives</span>. Complete your pending items to
          unlock all opportunities.
        </p>
      </div>
    </section>
  )
}

export default WelcomeBanner

