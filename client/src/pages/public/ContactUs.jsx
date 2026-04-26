import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./Public.module.css";
import { motion } from "framer-motion";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully!");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className={styles.container}>

      {/* HEADER */}
      <div className={styles.header}>
        <h1>Contact CCPD - NIT Warangal</h1>
        <p>We are here to assist you with placements and recruitment queries</p>
      </div>

      {/* CONTACT GRID */}
      <div className={styles.grid}>

        {/* LEFT INFO */}
        <div className={styles.infoBox}>
          {[
            { icon: "📍", title: "Address", desc: "NIT Warangal, Telangana - 506004" },
            { icon: "📧",title: "Email", desc: (<>taps@nitw.ac.in <br />ccpd_hod@nitw.ac.in</>)},
            { icon: "📞", title: "Phone", desc: "+91-870-246-2022" },
            { icon: "⏰", title: "Office Hours", desc: "Mon–Fri: 9 AM – 5:30 PM" },
          ].map((item, i) => (
            <motion.div key={i} className={styles.infoItem} whileHover={{ scale: 1.04 }}>
              <div className={styles.icon}>{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FORM */}
        <motion.form
          className={styles.formBox}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h3>Send Message</h3>

          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />

          <textarea
            rows="5"
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />

          <button type="submit">Send Message</button>
        </motion.form>
      </div>

      {/* HOW TO REACH */}
      <div className={styles.reachSection}>
        <h2>How to Reach Us</h2>

        <div className={styles.reachGrid}>
          <div className={styles.reachCard}>✈️ Hyderabad Airport (~160 km)</div>
          <div className={styles.reachCard}>🚆 Kazipet Junction (10 km)</div>
          <div className={styles.reachCard}>🚗 Well connected by road</div>
        </div>
      </div>

      {/* PROFILE + MAP */}
      <div className={styles.locationWrapper}>

        {/* PROFILE */}
        <div className={styles.profileBox}>
          <img
            src="P._Venkata_Suresh.jpg"
            alt="Professor"
            className={styles.profileImg}
          />

          <h3>Prof. P Venkata Suresh</h3>
          <p className={styles.role}>Professor</p>
          <p>Head of CCPD</p>

          <div className={styles.contactDetails}>
            <p>📞 +91 94901 65357</p>
            <p>📧 taps@nitw.ac.in</p>
            <p>📧 ccpd_hod@nitw.ac.in</p>
          </div>

          <div className={styles.addressBox}>
            <h4>Full Address</h4>
            <p>
              Centre for Career Planning & Development <br />
              National Institute of Technology Warangal <br />
              Hanamkonda, Warangal - 506004 <br />
              Telangana, India
            </p>
          </div>
        </div>

        {/* MAP */}
        <div className={styles.mapCard}>
        <h3 className={styles.mapTitle}>Campus Location</h3>

        <div className={styles.mapBox}>
            <iframe
            title="NIT Warangal Map"
            src="https://www.google.com/maps?q=NIT+Warangal&output=embed"
            loading="lazy"
            ></iframe>
        </div>
        </div>

      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2>Need Help?</h2>
        <p>Contact us anytime for placement support</p>

        <div className={styles.ctaButtons}>
          <a href="mailto:placement@nitw.ac.in" className={styles.primary}>
            Email Us
          </a>
          <a href="tel:+918702462022" className={styles.outline}>
            Call Us
          </a>
        </div>
      </div>

    </section>
  );
};

export default ContactUs;
