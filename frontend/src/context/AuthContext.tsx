'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    googleLogin: (idToken: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data.data);

            // If the user's frontend token is missing (e.g. they logged in before the update), sync it now
            if (!Cookies.get('clientToken')) {
                try {
                    const refreshRes = await api.post('/auth/refresh-token');
                    if (refreshRes.data?.data?.accessToken) {
                        Cookies.set('clientToken', refreshRes.data.data.accessToken, { expires: 7, path: '/' });
                    }
                } catch (e) {
                    // silently ignore
                }
            }
        } catch (err) {
            setUser(null);
            Cookies.remove('clientToken', { path: '/' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        setUser(res.data.data.user);
        if (res.data.data.accessToken) {
            Cookies.set('clientToken', res.data.data.accessToken, { expires: 7, path: '/' });
        }

        if (res.data.data.user.role === 'ADMIN') router.push('/admin');
        else if (res.data.data.user.role === 'PROVIDER') router.push('/provider/dashboard');
        else router.push('/');
    };

    const googleLogin = async (idToken: string) => {
        const res = await api.post('/auth/google-login', { idToken });
        setUser(res.data.data.user);
        if (res.data.data.accessToken) {
            Cookies.set('clientToken', res.data.data.accessToken, { expires: 7, path: '/' });
        }

        if (res.data.data.user.role === 'ADMIN') router.push('/admin');
        else if (res.data.data.user.role === 'PROVIDER') router.push('/provider/dashboard');
        else router.push('/');
    };

    const register = async (data: any) => {
        const res = await api.post('/auth/register', data);
        setUser(res.data.data.user);
        if (res.data.data.accessToken) {
            Cookies.set('clientToken', res.data.data.accessToken, { expires: 7, path: '/' });
        }
        
        if (res.data.data.user.role === 'PROVIDER') router.push('/provider/dashboard');
        else router.push('/');
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
        Cookies.remove('clientToken', { path: '/' });
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, googleLogin, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
