import React from 'react'
import styles from './PlacementProcess.module.css'

const steps = [
  {
    title: 'Step 01 · Profile & Eligibility',
    description:
      'Students complete their academic and resume details. Admin verifies records and locks critical fields for the active season.',
  },
  {
    title: 'Step 02 · Job Announcement',
    description:
      'Companies submit job descriptions, CTC and eligibility. TPO/Admin approves drives and publishes them to eligible students.',
  },
  {
    title: 'Step 03 · Applications & Shortlisting',
    description:
      'Eligible students apply with the most relevant resume. Recruiters review profiles, create shortlists and schedule assessments.',
  },
  {
    title: 'Step 04 · Interviews & Offers',
    description:
      'Online tests, technical and HR interviews are conducted. Final offers are recorded and tracked through the Offer Management module.',
  },
]

const PlacementProcess = () => {
  return (
    <section className={styles.section}>
      <header className={styles.header}>
        <h2 className={styles.title}>Placement Process Overview</h2>
        <p className={styles.subtitle}>
          A transparent, step‑by‑step workflow for students, recruiters and the T&amp;P Cell.
        </p>
      </header>
      <div className={styles.timeline}>
        {steps.map((step, index) => (
          <article key={step.title} className={styles.step}>
            <div className={styles.badge}>{index + 1}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PlacementProcess

