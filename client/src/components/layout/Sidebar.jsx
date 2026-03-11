import { NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';
import { FiHome, FiUser, FiBriefcase, FiFileText, FiUsers, FiCheckSquare, FiBarChart2, FiUpload, FiSettings, FiCalendar, FiClipboard } from 'react-icons/fi';

const sidebarConfig = {
    student: {
        title: 'Student Portal',
        links: [
            { to: '/student/dashboard', label: 'Dashboard', icon: <FiHome /> },
            { to: '/student/profile', label: 'My Profile', icon: <FiUser /> },
            { to: '/student/apply', label: 'Browse Jobs', icon: <FiBriefcase /> },
            { to: '/student/applications', label: 'My Applications', icon: <FiFileText /> },
        ],
    },
    company: {
        title: 'Company Portal',
        links: [
            { to: '/company/dashboard', label: 'Dashboard', icon: <FiHome /> },
            { to: '/company/jobs', label: 'Job Postings', icon: <FiBriefcase /> },
            { to: '/company/pipeline', label: 'Candidate Pipeline', icon: <FiUsers /> },
            { to: '/company/interviews', label: 'Interviews', icon: <FiCalendar /> },
        ],
    },
    admin: {
        title: 'Admin Panel',
        links: [
            { to: '/admin/dashboard', label: 'Dashboard', icon: <FiHome /> },
            { to: '/admin/verify', label: 'User Verification', icon: <FiCheckSquare /> },
            { to: '/admin/job-approvals', label: 'Job Approvals', icon: <FiClipboard /> },
        ],
    },
    tpo: {
        title: 'TPO Panel',
        links: [
            { to: '/tpo/dashboard', label: 'Dashboard', icon: <FiHome /> },
            { to: '/tpo/drives', label: 'Drives', icon: <FiSettings /> },
            { to: '/tpo/legacy-import', label: 'Legacy Import', icon: <FiUpload /> },
            { to: '/tpo/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
        ],
    },
};

const Sidebar = ({ role }) => {
    const config = sidebarConfig[role];
    if (!config) return null;

    return (
        <div className={styles.dashboardLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h3>{config.title}</h3>
                    <p>Welcome back!</p>
                </div>
                <ul className={styles.sidebarNav}>
                    {config.links.map((link) => (
                        <li key={link.to}>
                            <NavLink to={link.to} className={({ isActive }) => isActive ? styles.active : ''}>
                                <span className={styles.navIcon}>{link.icon}</span>
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

export default Sidebar;
