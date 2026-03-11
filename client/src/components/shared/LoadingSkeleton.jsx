import styles from './Shared.module.css';

const LoadingSkeleton = ({ rows = 5, type = 'page' }) => {
    if (type === 'cards') {
        return (
            <div className={styles.skeletonGrid}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={styles.skeletonCard}>
                        <div className={`skeleton ${styles.skeletonIcon}`}></div>
                        <div className={styles.skeletonLines}>
                            <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '60%' }}></div>
                            <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '40%' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={styles.skeletonContainer}>
            <div className={`skeleton ${styles.skeletonHeader}`}></div>
            <div className={`skeleton ${styles.skeletonSubheader}`}></div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className={`skeleton ${styles.skeletonRow}`}></div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
