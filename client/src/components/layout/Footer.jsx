import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerBrand}>
                    <h3>NITW CCPD</h3>
                    <p>
                        Centre for Career Planning & Development, National Institute of Technology Warangal.
                        Facilitating industry-academia connections since 1959.
                    </p>
                </div>
                <div className={styles.footerSection}>
                    <h4>Quick Links</h4>
                    <Link to="/about">About TPO</Link>
                    <Link to="/recruiters">Recruiters</Link>
                    <Link to="/stats">Placement Stats</Link>
                    <Link to="/contact">Contact Us</Link>
                </div>
                <div className={styles.footerSection}>
                    <h4>Students</h4>
                    <Link to="/register/student">Register</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/forgot-password">Reset Password</Link>
                </div>
                <div className={styles.footerSection}>
                    <h4>Companies</h4>
                    <Link to="/register/company">Register</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/contact">Contact TPO</Link>
                </div>
            </div>
            <div className={styles.footerBottom}>
                <p>© {new Date().getFullYear()} NIT Warangal — Centre for Career Planning & Development. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
