import { Link } from 'react-router-dom';
import styles from './Shared.module.css';

const NotFound = () => {
    return (
        <div className={styles.notFound}>
            <div className={styles.notFoundCode}>404</div>
            <h1 className={styles.notFoundTitle}>Page Not Found</h1>
            <p className={styles.notFoundDesc}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary btn-lg">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
