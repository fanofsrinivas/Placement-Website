import React from 'react'
import styles from './PageHeader.module.css'

const PageHeader = () => {
  return (
    <section className={styles.section}>
      <p className={styles.kicker}>About Training &amp; Placement Cell</p>
      <h1 className={styles.heading}>Bridging campus talent with industry opportunity.</h1>
      <p className={styles.text}>
        The Training &amp; Placement Cell acts as a strategic interface between the institute and the
        corporate world, enabling students to transition seamlessly from academics to professional
        careers.
      </p>
    </section>
  )
}

export default PageHeader

