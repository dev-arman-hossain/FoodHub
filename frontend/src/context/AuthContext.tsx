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
        } catch (err) {
            setUser(null);
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
            Cookies.set('clientToken', res.data.data.accessToken, { expires: 7 });
        }

        if (res.data.data.user.role === 'ADMIN') router.push('/admin');
        else if (res.data.data.user.role === 'PROVIDER') router.push('/provider/dashboard');
        else router.push('/');
    };

    const register = async (data: any) => {
        const res = await api.post('/auth/register', data);
        setUser(res.data.data.user);
        if (res.data.data.accessToken) {
            Cookies.set('clientToken', res.data.data.accessToken, { expires: 7 });
        }
        
        if (res.data.data.user.role === 'PROVIDER') router.push('/provider/dashboard');
        else router.push('/');
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
        Cookies.remove('clientToken');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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
