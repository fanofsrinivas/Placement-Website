import React from 'react'
import styles from './AboutTPO.module.css'
import Navbar from '../Home/components/Navbar.jsx'
import Footer from '../Home/components/Footer.jsx'
import PageHeader from './components/PageHeader.jsx'
import MissionVision from './components/MissionVision.jsx'
import TPOMessage from './components/TPOMessage.jsx'
import FacultyTeam from './components/FacultyTeam.jsx'
import StudentTeam from './components/StudentTeam.jsx'
import ContactCTA from './components/ContactCTA.jsx'

const AboutTPO = () => {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <PageHeader />
        <MissionVision />
        <TPOMessage />
        <FacultyTeam />
        <StudentTeam />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  )
}

export default AboutTPO

