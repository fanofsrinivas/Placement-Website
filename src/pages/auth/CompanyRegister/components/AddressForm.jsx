import React from 'react'
import styles from './AddressForm.module.css'

const AddressForm = () => {
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Office Address</h2>
      <p className={styles.subtitle}>Address details for correspondence and visit planning.</p>
      <div className={styles.grid}>
        <div className={styles.fullWidth}>
          <label htmlFor="street">Street Address</label>
          <input id="street" type="text" placeholder="Building, street, locality" />
        </div>
        <div className={styles.field}>
          <label htmlFor="city">City</label>
          <input id="city" type="text" placeholder="e.g. Bengaluru" />
        </div>
        <div className={styles.field}>
          <label htmlFor="state">State</label>
          <input id="state" type="text" placeholder="e.g. Karnataka" />
        </div>
        <div className={styles.field}>
          <label htmlFor="country">Country</label>
          <input id="country" type="text" placeholder="e.g. India" />
        </div>
        <div className={styles.field}>
          <label htmlFor="pincode">PIN / ZIP Code</label>
          <input id="pincode" type="text" placeholder="e.g. 560001" />
        </div>
      </div>
    </section>
  )
}

export default AddressForm

