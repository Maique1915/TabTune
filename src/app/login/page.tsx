'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Save user data to localStorage
            localStorage.setItem('cifrai_user', JSON.stringify(data.user));

            // Redirect to profile on success (or home)
            router.push('/profile');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0f2023] font-display text-white">
            {/* Background Abstract Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-40 blur-3xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(7, 182, 213, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)',
                        clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)'
                    }}
                />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full px-6 py-12 flex justify-center">
                {/* Login Card */}
                <div
                    className="rounded-xl p-8 md:p-10 shadow-2xl flex flex-col gap-8 backdrop-blur-xl border border-white/10 w-full"
                    style={{
                        backgroundColor: 'rgba(15, 32, 35, 0.7)', // #0f2023 with 0.7 opacity
                        maxWidth: '480px'
                    }}
                >

                    {/* Branding */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-12 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-5xl">
                                graphic_eq
                            </span>
                        </div>
                        <div className="text-center">
                            <h1 className="text-white text-3xl font-bold tracking-tight mb-1">Cifrai</h1>
                            <p className="text-primary text-lg font-medium">Welcome Back, Artist</p>
                        </div>
                    </div>

                    {/* Inputs */}
                    <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium px-1">Email</label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-xl text-white border border-[#3a5155] focus:ring-2 focus:ring-primary focus:border-primary h-14 placeholder:text-[#9bb6bb]/50 p-[15px] text-base font-normal transition-all outline-none"
                                style={{ backgroundColor: 'rgba(27, 38, 39, 0.6)' }}
                                placeholder="name@studio.com"
                                type="email"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-white text-sm font-medium px-1">Password</label>
                            <div className="relative flex items-center">
                                <input
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full rounded-xl text-white border border-[#3a5155] focus:ring-2 focus:ring-primary focus:border-primary h-14 placeholder:text-[#9bb6bb]/50 p-[15px] text-base font-normal transition-all outline-none"
                                    style={{ backgroundColor: 'rgba(27, 38, 39, 0.6)' }}
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    required
                                />
                                <button
                                    className="absolute right-4 text-[#9bb6bb] hover:text-white transition-colors flex items-center cursor-pointer"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined select-none text-2xl">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Meta Text */}
                        <div className="flex justify-end">
                            <a className="text-primary text-sm font-medium hover:underline cursor-pointer">Forgot Password?</a>
                        </div>

                        {/* Action Button */}
                        <button
                            className="mt-2 flex w-full items-center justify-center rounded-xl h-14 bg-primary text-[#0f2023] text-lg font-bold leading-normal transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(7,182,213,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px bg-[#3a5155] flex-1"></div>
                            <span className="text-[#9bb6bb] text-xs font-medium uppercase tracking-widest">Or continue with</span>
                            <div className="h-px bg-[#3a5155] flex-1"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 rounded-xl border border-[#3a5155] h-12 bg-transparent hover:bg-white/5 transition-all group">
                                <svg className="size-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
                                </svg>
                                <span className="text-white text-sm font-medium">Google</span>
                            </button>
                            <button className="flex items-center justify-center gap-3 rounded-xl border border-[#3a5155] h-12 bg-transparent hover:bg-white/5 transition-all group">
                                <svg className="size-5 fill-white" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                                </svg>
                                <span className="text-white text-sm font-medium">GitHub</span>
                            </button>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center">
                        <p className="text-[#9bb6bb] text-sm">
                            Don't have an account?
                            <Link href="/signup" className="text-primary font-bold hover:underline ml-1">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Support Info */}
                <div className="mt-8 absolute bottom-6 text-center text-[#9bb6bb]/40 text-[10px] uppercase tracking-[0.2em] w-full left-0">
                    © 2024 Cifrai Animator Studio. All rights reserved.
                </div>
            </div>
        </div>
    );
}
