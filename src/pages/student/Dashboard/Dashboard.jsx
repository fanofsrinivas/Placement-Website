import React from 'react'
import styles from './Dashboard.module.css'
import Navbar from '../../public/Home/components/Navbar.jsx'
import Footer from '../../public/Home/components/Footer.jsx'
import WelcomeBanner from './components/WelcomeBanner.jsx'
import ProfileStrength from './components/ProfileStrength.jsx'
import StudentStats from './components/StudentStats.jsx'
import EligibleCompanies from './components/EligibleCompanies.jsx'
import RecentActivity from './components/RecentActivity.jsx'
import Deadlines from './components/Deadlines.jsx'

const Dashboard = () => {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.layout}>
        <aside className={styles.sidebar}>
          <ProfileStrength />
          <StudentStats />
        </aside>
        <section className={styles.main}>
          <WelcomeBanner />
          <EligibleCompanies />
          <div className={styles.bottomRow}>
            <RecentActivity />
            <Deadlines />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard

