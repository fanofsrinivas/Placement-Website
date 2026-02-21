import React from 'react'
import styles from './ContactCTA.module.css'

const ContactCTA = () => {
  return (
    <section className={styles.section}>
      <div>
        <h2 className={styles.title}>Get in touch with the T&amp;P Cell</h2>
        <p className={styles.text}>
          For campus recruitment, internship opportunities or collaboration proposals, please reach
          out to the Training &amp; Placement Office.
        </p>
      </div>
      <button type="button" className={styles.button}>
        Contact T&amp;P Cell
      </button>
    </section>
  )
}

export default ContactCTA

