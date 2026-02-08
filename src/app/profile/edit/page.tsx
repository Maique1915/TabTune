'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        language: 'en',
    });
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('cifrai_user');

        if (!storedUser) {
            // Redirect to login if not authenticated
            router.push('/login');
            return;
        }

        try {
            const user = JSON.parse(storedUser);
            setFormData({
                name: user.name || '',
                email: user.email || '',
                language: user.preferred_language || 'en',
            });
        } catch (error) {
            console.error('Error parsing user data:', error);
            router.push('/login');
            return;
        }

        setIsLoading(false);
    }, [router]);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulating API call for now (or TODO: Implement /api/user/update)
        setTimeout(() => {
            // Update local storage to reflect changes immediately for UX
            const storedUser = localStorage.getItem('cifrai_user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const updatedUser = { ...user, ...formData, preferred_language: formData.language };
                localStorage.setItem('cifrai_user', JSON.stringify(updatedUser));
            }

            setLoading(false);
            router.push('/profile');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#0f2023] font-display text-white relative overflow-hidden flex justify-center py-12 px-6">
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
    );
}
