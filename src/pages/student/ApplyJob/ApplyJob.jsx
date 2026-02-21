import React from 'react'
import styles from './ApplyJob.module.css'
import Navbar from '../../public/Home/components/Navbar.jsx'
import Footer from '../../public/Home/components/Footer.jsx'
import JobDetailsCard from './components/JobDetailsCard.jsx'
import EligibilityCheck from './components/EligibilityCheck.jsx'
import ApplicationForm from './components/ApplicationForm.jsx'
import ResumeSelector from './components/ResumeSelector.jsx'
import AdditionalInfo from './components/AdditionalInfo.jsx'
import TermsCheckbox from './components/TermsCheckbox.jsx'
import SubmitApplication from './components/SubmitApplication.jsx'

const ApplyJob = () => {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.heading}>Apply to Job</h1>
          <p className={styles.subheading}>
            Review eligibility, confirm your details and choose the most relevant resume before you
            submit your application.
          </p>
        </div>
        <div className={styles.grid}>
          <section className={styles.left}>
            <JobDetailsCard />
            <EligibilityCheck />
            <ApplicationForm />
            <ResumeSelector />
            <AdditionalInfo />
            <TermsCheckbox />
            <SubmitApplication />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ApplyJob

