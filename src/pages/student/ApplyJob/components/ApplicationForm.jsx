import React from 'react'
import styles from './ApplicationForm.module.css'

const ApplicationForm = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Application Details</h2>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="fullName">Full Name</label>
          <input id="fullName" type="text" defaultValue="Ankit Sharma" />
        </div>
        <div className={styles.field}>
          <label htmlFor="roll">Roll Number</label>
          <input id="roll" type="text" defaultValue="21CS123" />
        </div>
        <div className={styles.field}>
          <label htmlFor="degree">Degree</label>
          <input id="degree" type="text" defaultValue="B.Tech CSE" />
        </div>
        <div className={styles.field}>
          <label htmlFor="cgpa">Current CGPA</label>
          <input id="cgpa" type="number" step="0.01" defaultValue="8.4" />
        </div>
        <div className={styles.fullField}>
          <label htmlFor="email">Email (Official)</label>
          <input id="email" type="email" defaultValue="ankit.sharma@college.edu" />
        </div>
      </div>
    </section>
  )
}

export default ApplicationForm

