import React from 'react'
import styles from './Profile.module.css'
import Navbar from '../../public/Home/components/Navbar.jsx'
import Footer from '../../public/Home/components/Footer.jsx'
import ProfileHeader from './components/ProfileHeader.jsx'
import PersonalDetails from './components/PersonalDetails.jsx'
import EducationDetails from './components/EducationDetails.jsx'
import SkillsSection from './components/SkillsSection.jsx'
import ProjectsSection from './components/ProjectsSection.jsx'
import InternshipsSection from './components/InternshipsSection.jsx'
import ResumeSection from './components/ResumeSection.jsx'
import ProfileActions from './components/ProfileActions.jsx'

const Profile = () => {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <ProfileHeader />
        <div className={styles.grid}>
          <section className={styles.left}>
            <PersonalDetails />
            <EducationDetails />
            <SkillsSection />
          </section>
          <section className={styles.right}>
            <ProjectsSection />
            <InternshipsSection />
            <ResumeSection />
            <ProfileActions />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Profile

