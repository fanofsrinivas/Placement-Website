import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

const Navbar = () => {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <div className={styles.logoCircle}>T&P</div>
          <div className={styles.brandText}>
            <span className={styles.collegeName}>Your College Name</span>
            <span className={styles.cellName}>Training &amp; Placement Cell</span>
          </div>
        </Link>

        <nav className={styles.navLinks}>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            Home
          </NavLink>
          <NavLink
            to="/about-tpo"
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            About T&amp;P Cell
          </NavLink>
          <NavLink
            to="/recruiters"
            className={styles.link}
          >
            Recruiters
          </NavLink>
          <NavLink
            to="/stats"
            className={styles.link}
          >
            Placement Stats
          </NavLink>
          <NavLink
            to="/contact"
            className={styles.link}
          >
            Contact Us
          </NavLink>
        </nav>

        <div className={styles.actions}>
          <Link to="/login" className={styles.loginBtn}>
            Login
          </Link>
          <Link to="/register/company" className={styles.primaryBtn}>
            Recruiter Register
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar

