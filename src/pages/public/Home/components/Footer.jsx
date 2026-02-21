import React from 'react'
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <p className={styles.heading}>Training &amp; Placement Cell</p>
          <p className={styles.text}>Your College Name, City, State, PIN</p>
          <p className={styles.text}>Email: tpo@college.edu · Phone: +91-00000 00000</p>
        </div>
        <div>
          <p className={styles.heading}>Quick Links</p>
          <ul className={styles.list}>
            <li>Placement Policy</li>
            <li>Student Guidelines</li>
            <li>Recruiter Brochure</li>
          </ul>
        </div>
        <div>
          <p className={styles.heading}>Connect</p>
          <ul className={styles.listInline}>
            <li>LinkedIn</li>
            <li>X</li>
            <li>Instagram</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>
      <p className={styles.bottomLine}>
        © {new Date().getFullYear()} Training &amp; Placement Cell · College Name. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer

