'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/modules/core/presentation/context/user-context';
import { Header } from '@/shared/components/layout/Header';

export default function EditProfilePage() {
    const router = useRouter();
    const { user: contextUser, loading: userLoading, setUser } = useUser();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        language: 'en',
    });
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userLoading) {
            if (!contextUser) {
                router.push('/login');
                return;
            }

            setFormData({
                name: contextUser.name || '',
                email: contextUser.email || '',
                language: contextUser.preferredLanguage || 'en',
            });
            setIsLoading(false);
        }
    }, [contextUser, userLoading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contextUser) return;

        setLoading(true);

        try {
            const response = await fetch('/api/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: contextUser.id,
                    name: formData.name,
                    email: formData.email,
                    preferredLanguage: formData.language,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update context which also updates localStorage
                setUser(data.user);
                alert('Perfil atualizado com sucesso!');
                router.push('/profile');
            } else {
                alert(data.error || 'Erro ao atualizar perfil');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Erro de conexão ao atualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0a1214] via-[#0f1c1f] to-[#0a1214] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-zinc-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0f2023]">
            <Header />
            <div className="flex-1 font-display text-white relative overflow-hidden flex justify-center py-12 px-6">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] opacity-20 blur-[100px] rounded-full bg-primary/20" />
                </div>

                <div className="relative z-10 w-full max-w-2xl flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <h1 className="text-3xl font-bold">Edit Profile</h1>
                    </div>

                    <div className="rounded-2xl p-8 bg-[#162a2d]/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <form onSubmit={handleSave} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-black/20 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-white outline-none transition-all"
                                    type="text"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-black/20 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-white outline-none transition-all"
                                    type="email"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Preferred Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full rounded-xl bg-black/20 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-white outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="en">English (EN)</option>
                                    <option value="pt">Portuguese (PT)</option>
                                    <option value="es">Spanish (ES)</option>
                                </select>
                            </div>

                            <div className="h-px bg-white/10 my-2"></div>

                            <div className="flex gap-4">
                                <Link href="/profile" className="flex-1">
                                    <button type="button" className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-bold">
                                        Cancel
                                    </button>
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 rounded-xl bg-primary text-[#0f2023] hover:brightness-110 transition-all font-bold shadow-[0_0_20px_rgba(7,182,213,0.3)] disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
