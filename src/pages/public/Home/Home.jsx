import React from 'react'
import styles from './Home.module.css'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import StatsCounter from './components/StatsCounter.jsx'
import AnnouncementTicker from './components/AnnouncementTicker.jsx'
import PlacementProcess from './components/PlacementProcess.jsx'
import RecruiterLogos from './components/RecruiterLogos.jsx'
import Testimonials from './components/Testimonials.jsx'
import Footer from './components/Footer.jsx'

const Home = () => {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <Hero />
        <StatsCounter />
        <AnnouncementTicker />
        <PlacementProcess />
        <RecruiterLogos />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

export default Home

