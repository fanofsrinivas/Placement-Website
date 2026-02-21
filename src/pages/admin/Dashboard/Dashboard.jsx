import React from 'react'
import styles from './Dashboard.module.css'
import Navbar from '../../public/Home/components/Navbar.jsx'
import Footer from '../../public/Home/components/Footer.jsx'
import SystemStats from './components/SystemStats.jsx'
import PendingQueue from './components/PendingQueue.jsx'
import AdminActivity from './components/AdminActivity.jsx'
import QuickApprovals from './components/QuickApprovals.jsx'

const Dashboard = () => {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Admin Dashboard</h1>
          <p className={styles.subheading}>
            Monitor system health, pending approvals and recent actions across students, companies
            and jobs.
          </p>
        </header>
        <SystemStats />
        <div className={styles.grid}>
          <section className={styles.left}>
            <PendingQueue />
            <AdminActivity />
          </section>
          <section className={styles.right}>
            <QuickApprovals />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard

