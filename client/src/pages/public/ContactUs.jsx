import { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './Public.module.css';

const ContactUs = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Message sent successfully! We will get back to you soon.');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
                <h2>Contact Us</h2>
                <p>Get in touch with the CCPD team</p>
                <div className={styles.accent}></div>
            </div>

            <div className={styles.contactGrid}>
                <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                        <div className={styles.contactIcon}>📍</div>
                        <div>
                            <h4>Address</h4>
                            <p>Centre for Career Planning & Development<br />NIT Warangal, Warangal - 506004<br />Telangana, India</p>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <div className={styles.contactIcon}>📧</div>
                        <div>
                            <h4>Email</h4>
                            <p>placement@nitw.ac.in<br />tpo@nitw.ac.in</p>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <div className={styles.contactIcon}>📞</div>
                        <div>
                            <h4>Phone</h4>
                            <p>+91-870-246-2022<br />+91-870-246-2023</p>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <div className={styles.contactIcon}>⏰</div>
                        <div>
                            <h4>Office Hours</h4>
                            <p>Monday – Friday: 9:00 AM – 5:30 PM<br />Saturday: 9:00 AM – 1:00 PM</p>
                        </div>
                    </div>
                </div>

                <form className="card" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="contact-name">Full Name</label>
                        <input id="contact-name" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact-email">Email</label>
                        <input id="contact-email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="you@example.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact-subject">Subject</label>
                        <input id="contact-subject" type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required placeholder="Subject" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contact-message">Message</label>
                        <textarea id="contact-message" rows="5" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required placeholder="Your message..." />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactUs;
