import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './Layout.module.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const getDashboardLink = () => {
        if (!user) return '/login';
        switch (user.role) {
            case 'student': return '/student/dashboard';
            case 'company': return '/company/dashboard';
            case 'admin': return '/admin/dashboard';
            case 'tpo': return '/tpo/dashboard';
            case 'coordinator': return '/coordinator/dashboard';
            case 'faculty': return '/faculty/dashboard';
            default: return '/';
        }
    };

    const getInitial = () => {
        if (user?.role === 'student') {
            return (user.studentProfile?.firstName?.[0] || user.email[0]).toUpperCase();
        }
        if (user?.role === 'company') {
            return (user.companyProfile?.companyName?.[0] || user.email[0]).toUpperCase();
        }
        if (user?.role === 'faculty') {
            return (user.facultyProfile?.firstName?.[0] || user.email[0]).toUpperCase();
        }
        return user?.email?.[0]?.toUpperCase() || '?';
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navInner}>
                <Link to="/" className={styles.logo}>
                    <div className={styles.logoIcon}>N</div>
                    <div>
                        NITW CCPD
                        <span className={styles.logoSub}>Centre for Career Planning & Development</span>
                    </div>
                </Link>

                <ul className={`${styles.navLinks} ${mobileOpen ? styles.mobileOpen : ''}`}>
                    <li><NavLink to="/" end>Home</NavLink></li>
                    <li><NavLink to="/about">About</NavLink></li>
                    <li><NavLink to="/recruiters">Recruiters</NavLink></li>
                    <li><NavLink to="/stats">Statistics</NavLink></li>
                    <li><NavLink to="/contact">Contact</NavLink></li>
                </ul>

                <div className={styles.navActions}>
                    {user ? (
                        <>
                            <Link to={getDashboardLink()} className="btn btn-secondary btn-sm">
                                Dashboard
                            </Link>
                            <div className={styles.navUser}>
                                <div className={styles.navAvatar}>{getInitial()}</div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{user.email.split('@')[0]}</div>
                                    <div className={styles.navRole}>{user.role}</div>
                                </div>
                            </div>
                            <button onClick={logout} className="btn btn-outline btn-sm" style={{ borderColor: '#fff', color: '#fff' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline btn-sm" style={{ borderColor: '#fff', color: '#fff' }}>
                                Login
                            </Link>
                            <Link to="/register/student" className="btn btn-secondary btn-sm">
                                Register
                            </Link>
                        </>
                    )}
                    <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
