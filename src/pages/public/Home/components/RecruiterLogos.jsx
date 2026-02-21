import React from 'react'
import styles from './RecruiterLogos.module.css'

const logos = ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Accenture', 'Adobe', 'Flipkart']

const RecruiterLogos = () => {
  return (
    <section className={styles.section} aria-label="Recruiting partners">
      <div className={styles.header}>
        <h2 className={styles.title}>Our Recruiting Partners</h2>
        <p className={styles.subtitle}>Leading product and services companies hiring from campus.</p>
      </div>
      <div className={styles.slider}>
        <div className={styles.track}>
          {[...logos, ...logos].map((name, index) => (
            <div key={`${name}-${index}`} className={styles.logoCard}>
              <span className={styles.logoText}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecruiterLogos

