import { Component } from 'react';
import styles from './Shared.module.css';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2 className={styles.errorTitle}>Something went wrong</h2>
                    <p className={styles.errorMessage}>
                        {this.state.error?.message || 'An unexpected error occurred.'}
                    </p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>
                        Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
