import React from 'react'
import styles from './RecentJobs.module.css'

const jobs = [
  { title: 'Software Engineer', status: 'Active', applications: 72 },
  { title: 'SDE Intern', status: 'Applications Closed', applications: 120 },
]

const RecentJobs = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Recent Jobs</h2>
      <ul className={styles.list}>
        {jobs.map((job) => (
          <li key={job.title} className={styles.item}>
            <div>
              <p className={styles.jobTitle}>{job.title}</p>
              <p className={styles.meta}>
                {job.status} · {job.applications} applications
              </p>
            </div>
            <button type="button" className={styles.viewButton}>
              View Pipeline
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RecentJobs

