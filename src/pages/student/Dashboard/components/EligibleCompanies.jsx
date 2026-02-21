import React from 'react'
import styles from './EligibleCompanies.module.css'

const companies = [
  {
    name: 'Google',
    role: 'Software Engineer',
    ctc: '₹ 28 LPA',
    eligible: true,
    type: 'Full-time',
  },
  {
    name: 'TCS Digital',
    role: 'Developer',
    ctc: '₹ 7.5 LPA',
    eligible: true,
    type: 'Full-time',
  },
  {
    name: 'Adobe',
    role: 'Summer Intern (SDE)',
    ctc: '₹ 80k / month',
    eligible: true,
    type: 'Internship',
  },
]

const EligibleCompanies = () => {
  return (
    <section className={styles.card}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>Eligible Companies</h2>
          <p className={styles.subtitle}>Based on your current profile and eligibility criteria.</p>
        </div>
        <button type="button" className={styles.filterButton}>
          Filter by role / CTC
        </button>
      </header>
      <div className={styles.list}>
        {companies.map((company) => (
          <article key={company.name} className={styles.item}>
            <div>
              <p className={styles.company}>{company.name}</p>
              <p className={styles.role}>{company.role}</p>
              <p className={styles.meta}>
                {company.type} · <span>{company.ctc}</span>
              </p>
            </div>
            <button type="button" className={styles.applyButton}>
              Apply
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default EligibleCompanies

