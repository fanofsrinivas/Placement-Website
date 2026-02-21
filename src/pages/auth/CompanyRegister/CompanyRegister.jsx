import React from 'react'
import styles from './CompanyRegister.module.css'
import Navbar from '../../public/Home/components/Navbar.jsx'
import Footer from '../../public/Home/components/Footer.jsx'
import CompanyInfoForm from './components/CompanyInfoForm.jsx'
import ContactInfoForm from './components/ContactInfoForm.jsx'
import AddressForm from './components/AddressForm.jsx'
import CompanyCredentials from './components/CompanyCredentials.jsx'
import CompanySuccess from './components/CompanySuccess.jsx'

const CompanyRegister = () => {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.header}>
          <h1 className={styles.heading}>Recruiter Registration</h1>
          <p className={styles.subheading}>
            Share your organisation&apos;s details to receive access to the recruiter dashboard.
            All submissions are reviewed and approved by the Admin/T&amp;P Cell.
          </p>
        </section>
        <div className={styles.grid}>
          <div className={styles.left}>
            <CompanyInfoForm />
            <ContactInfoForm />
            <AddressForm />
            <CompanyCredentials />
          </div>
          <div className={styles.right}>
            <CompanySuccess />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CompanyRegister

