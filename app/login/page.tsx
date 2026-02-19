'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GraduationCap, Github } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            if (data.user) {
                // Fetch role from profiles
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('role, is_admin')
                    .eq('id', data.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    // Fallback or error handling if profile doesn't exist
                    // For now, let's assume if no profile, we stay or go to a generic page
                    setError("Could not retrieve user profile.");
                } else if (profile) {
                    if (profile.is_admin) {
                        router.push('/admin');
                        return;
                    }

                    if (profile.role === 'student') {
                        router.push('/dashboard/student');
                    } else if (profile.role === 'company') {
                        router.push('/dashboard/company');
                    } else {
                        // Default fallback
                        router.push('/');
                    }
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1C38] px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <Image
                            src="/logo1.png"
                            alt="Apprenticeship Logo"
                            width={180}
                            height={60}
                            className="h-12 w-auto object-contain"
                            priority
                        />
                    </Link>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                        Welcome back! Please enter your details.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-slate-100">
                    <form className="space-y-6" onSubmit={handleLogin}>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="name@example.com"
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 placeholder-slate-400 focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    placeholder="••••••••"
                                    className="block w-full rounded-lg border border-slate-300 px-3 py-2 placeholder-slate-400 focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-secondary"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary hover:text-primary/80">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-primary shadow-sm hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-all hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm hover:bg-slate-50 transition-colors"
                            >
                                <span className="sr-only">Sign in with Google</span>
                                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                    <path
                                        d="M12.0003 20.45c4.6669 0 8.5833-3.6667 8.5833-8.45 0-.4167-.0333-.825-.1-1.225h-8.4833v3.3917h4.8833c-.225 1.15-.875 2.125-1.8417 2.7667v2.3083h2.9583c1.725-1.5917 2.725-3.9333 2.725-6.675 0-.675-.075-1.325-.2-1.95h-11.525v-3.7917h-3.1333c-1.6 2.9167-1.6 6.5583 0 9.475l3.1333-2.3z"
                                        fill="#EA4335"
                                    />
                                    <path
                                        d="M12.0003 4.75c1.7917 0 3.4 1.05 4.3833 2.65l2.45-2.45c-1.85-2.1333-4.575-3.45-7.5-3.45-4.4083 0-8.2083 2.5083-9.9833 6.2083l3.6583 2.8417c.9-2.7333 3.4667-4.7083 6.3333-4.7083.475 0 1.5-.2 2.6583 1.1667l-2.0003 2.375z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.6751 13.9999c-.275-.8249-.425-1.7083-.425-2.6249s.15-1.8.425-2.625l-3.6583-2.8417c-1.5083 2.6334-1.5083 5.925 0 8.5584l3.6583-2.4667z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12.0003 24c3.2417 0 6.0667-1.35 8.1667-3.55l-2.9583-2.3083c-1.05.7417-2.4833 1.25-4.0417 1.25-2.8667 0-5.4333-1.975-6.3333-4.7083l-3.6583 2.8417c1.775 3.7 5.575 6.2083 9.9833 6.2083z"
                                        fill="#4285F4"
                                    />
                                </svg>
                            </button>

                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-500 shadow-sm hover:bg-slate-50 transition-colors"
                            >
                                <span className="sr-only">Sign in with GitHub</span>
                                <Github className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-2 text-center text-sm text-slate-300">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-medium text-white hover:text-slate-200 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
