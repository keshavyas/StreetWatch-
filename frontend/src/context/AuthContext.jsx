import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const data = await api.get('/user/profile');
                    const userData = { 
                        email: data.email, 
                        role: data.role || 'USER', 
                        id: data._id, 
                        name: data.name, 
                        tier: data.subscription,
                        scansLeft: data.scansLeft,
                        currentPlan: data.currentPlan
                    };
                    setUser(userData);
                } catch (error) {
                    console.error('Session expired or invalid token');
                    localStorage.removeItem('auth_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await api.post('/auth/login', { email, password });
            const userData = { 
                email: data.email, 
                role: data.role || 'USER', 
                id: data._id, 
                name: data.name, 
                tier: data.subscription,
                scansLeft: data.scansLeft,
                currentPlan: data.currentPlan
            };
            setUser(userData);
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('auth_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const data = await api.post('/auth/register', { email, password, name });
            const userData = { 
                email: data.email, 
                role: data.role || 'USER', 
                id: data._id, 
                name: data.name, 
                tier: data.subscription,
                scansLeft: data.scansLeft,
                currentPlan: data.currentPlan
            };
            setUser(userData);
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('auth_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    };

    const updateTier = (newTier) => {
        if (!user) return;
        const updated = { ...user, tier: newTier };
        setUser(updated);
        localStorage.setItem('auth_user', JSON.stringify(updated));
    }

    const value = {
        user,
        login,
        register,
        logout,
        updateTier,
        isAdmin: user?.role === 'ADMIN',
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
