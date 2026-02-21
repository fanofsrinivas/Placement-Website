import React from 'react'
import styles from './ProjectsSection.module.css'

const ProjectsSection = () => {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>Projects</h2>
      </header>
      <div className={styles.list}>
        <article className={styles.item}>
          <p className={styles.name}>College Placement Portal</p>
          <p className={styles.meta}>React · Node.js · MongoDB</p>
          <p className={styles.desc}>
            End‑to‑end platform for managing campus placements with student, recruiter, admin and
            TPO dashboards.
          </p>
        </article>
        <article className={styles.item}>
          <p className={styles.name}>Online Judge</p>
          <p className={styles.meta}>Express · Docker · Redis</p>
          <p className={styles.desc}>
            Built a mini competitive coding platform with problem management and submissions.
          </p>
        </article>
      </div>
    </section>
  )
}

export default ProjectsSection

