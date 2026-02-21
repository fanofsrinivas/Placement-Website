import React from 'react'
import styles from './Dashboard.module.css'
import Navbar from '../../public/Home/components/Navbar.jsx'
import Footer from '../../public/Home/components/Footer.jsx'
import CompanyWelcome from './components/CompanyWelcome.jsx'
import CompanyStats from './components/CompanyStats.jsx'
import RecentJobs from './components/RecentJobs.jsx'
import RecentApplicants from './components/RecentApplicants.jsx'
import UpcomingInterviews from './components/UpcomingInterviews.jsx'
import QuickActions from './components/QuickActions.jsx'

const Dashboard = () => {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <CompanyWelcome />
        <CompanyStats />
        <div className={styles.grid}>
          <section className={styles.left}>
            <RecentJobs />
            <UpcomingInterviews />
          </section>
          <section className={styles.right}>
            <RecentApplicants />
            <QuickActions />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard

