import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Configure axios
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('cpms_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('cpms_token'));
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('cpms_token');
        setToken(null);
        setUser(null);
    }, []);

    // Auto-logout on token expiry (2 hours)
    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiresAt = payload.exp * 1000;
                const timeout = expiresAt - Date.now();
                if (timeout <= 0) {
                    logout();
                    return;
                }
                const timer = setTimeout(logout, timeout);
                return () => clearTimeout(timer);
            } catch {
                logout();
            }
        }
    }, [token, logout]);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get('/auth/me');
                setUser(res.data);
            } catch {
                logout();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token, logout]);

    const login = async (email, password, role) => {
        const res = await api.post('/auth/login', { email, password, role });
        localStorage.setItem('cpms_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const registerStudent = async (data) => {
        const res = await api.post('/auth/register/student', data);
        localStorage.setItem('cpms_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const registerCompany = async (data) => {
        const res = await api.post('/auth/register/company', data);
        localStorage.setItem('cpms_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    return (
        <AuthContext.Provider value={{
            user, token, loading, login, logout,
            registerStudent, registerCompany, api,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export { api };
export default AuthContext;
