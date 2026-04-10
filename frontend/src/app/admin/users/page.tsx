'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { User } from '@/types';
import { Users, Shield, ShieldAlert, CheckCircle, XCircle, Search, Mail, Calendar, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TableSkeleton } from '@/components/shared/TableSkeleton';

const AdminUsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        setUpdatingId(userId);
        try {
            await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
            fetchUsers();
        } catch (err) {
            alert('Failed to update user status');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto px-6 py-12 md:py-20 space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-5xl font-display font-black text-zinc-900 tracking-tight">Platform Users</h1>
                    <p className="text-zinc-500 font-medium text-lg">Manage accounts and platform security</p>
                </div>
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-soft font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <TableSkeleton rows={8} />
            ) : (
                <div className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-xl shadow-zinc-200/20">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-950 text-white">
                            <tr>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest">User Details</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-center">Role</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50 font-medium">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="group hover:bg-zinc-50/50 transition-soft">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center font-black text-zinc-400 uppercase">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-zinc-900 font-bold">{u.name}</h4>
                                                <p className="text-xs text-zinc-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            u.role === 'ADMIN' ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                u.role === 'PROVIDER' ? "bg-orange-50 text-orange-600 border-orange-100" :
                                                    "bg-blue-50 text-blue-600 border-blue-100"
                                        )}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {u.status === 'ACTIVE' ? (
                                                <div className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Active
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-black uppercase">
                                                    <XCircle className="w-3.5 h-3.5" /> Suspended
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {u.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => toggleStatus(u.id, u.status)}
                                                disabled={updatingId === u.id}
                                                className={cn(
                                                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-soft active:scale-95 disabled:opacity-50",
                                                    u.status === 'ACTIVE' ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white" : "bg-green-50 text-green-500 hover:bg-green-500 hover:text-white"
                                                )}
                                            >
                                                {updatingId === u.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (u.status === 'ACTIVE' ? 'Suspend' : 'Activate')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-20 text-center text-zinc-300 italic">No users found matching your search</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;
