import React from 'react'
import styles from './Testimonials.module.css'

const testimonials = [
  {
    name: 'Ananya Gupta',
    role: 'SDE, Microsoft',
    batch: 'B.Tech CSE · 2024',
    quote:
      'The portal made it very clear which companies I was eligible for and kept my application status updated at every stage.',
  },
  {
    name: 'Rahul Verma',
    role: 'Data Analyst, Google',
    batch: 'B.Tech IT · 2023',
    quote:
      'Centralised drives, automated eligibility and resume management helped me focus on preparation instead of paperwork.',
  },
  {
    name: 'Sneha Nair',
    role: 'Consultant, Deloitte',
    batch: 'MBA · 2024',
    quote:
      'Scheduling, shortlists and offers were all visible in one dashboard. It brought transparency to the entire process.',
  },
]

const Testimonials = () => {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {testimonials.map((t) => (
          <article key={t.name} className={styles.card}>
            <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
            <div className={styles.meta}>
              <p className={styles.name}>{t.name}</p>
              <p className={styles.role}>{t.role}</p>
              <p className={styles.batch}>{t.batch}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Testimonials

