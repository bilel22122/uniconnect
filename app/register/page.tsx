'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GraduationCap, Building2, User, Mail, Lock, School, ArrowRight, Briefcase } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type Role = 'student' | 'company';

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();

    const [role, setRole] = useState<Role>('student');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        industry: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: '',
    });
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: false }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, boolean> = {};
        let hasError = false;

        // Common fields
        if (!formData.email) { newErrors.email = true; hasError = true; }
        if (!formData.password) { newErrors.password = true; hasError = true; }
        if (!formData.confirmPassword) { newErrors.confirmPassword = true; hasError = true; }

        // Role specific fields
        if (role === 'student') {
            if (!formData.fullName) { newErrors.fullName = true; hasError = true; }
            if (!formData.university) { newErrors.university = true; hasError = true; }
        } else {
            if (!formData.companyName) { newErrors.companyName = true; hasError = true; }
        }

        setErrors(newErrors);

        if (hasError) return;

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        role: role,
                        full_name: formData.fullName,
                        company_name: formData.companyName,
                        university: formData.university,
                        // If you added 'industry' to DB, add it here too. 
                        // Based on prompt "Data Mapping" list, industry wasn't explicitly requested to be mapped to a DB column 
                        // BUT prompt says "My Database 'profiles' table has these columns... company_name, role...". 
                        // It didn't listen 'industry' in the "My Database... columns" list, but the previous task added it to UI.
                        // I will include it in metadata just in case, or ignore if strict.
                        // Strict requirement: "My Database 'profiles' table has these columns: full_name, university, company_name, role".
                        // I will ONLY map what is requested to avoid errors if the trigger blindly inserts.
                        // Actually, the trigger typically copies what's in metadata. If I pass extra, it might not hurt, but let's stick to the list + common sense.
                    }
                }
            });

            if (error) {
                throw error;
            }

            if (data.user) {
                alert("Registration successful! Redirecting...");
                if (role === 'student') {
                    router.push('/dashboard/student');
                } else {
                    router.push('/dashboard/company');
                }
            }

        } catch (err: any) {
            alert(err.message);
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
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                        Join the network of top talent and leading companies.
                    </p>
                </div>

                {/* Role Switcher */}
                <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
                    <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'student'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                            }`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        I am a Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('company')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'company'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                            }`}
                    >
                        <Building2 className="w-4 h-4" />
                        I am a Company
                    </button>
                </div>

                {/* Card */}
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-slate-100">
                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {role === 'student' ? (
                            // Student Fields
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            name="fullName"
                                            type="text"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            className={`block w-full pl-10 rounded-lg border ${errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} px-3 py-2 placeholder-slate-400 focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm transition-colors`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">University / School</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <School className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            name="university"
                                            type="text"
                                            value={formData.university}
                                            onChange={handleInputChange}
                                            className={`block w-full pl-10 rounded-lg border ${errors.university ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} px-3 py-2 placeholder-slate-400 focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm transition-colors`}
                                            placeholder="Harvard University"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Company Fields
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            name="companyName"
                                            type="text"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            className={`block w-full pl-10 rounded-lg border ${errors.companyName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} px-3 py-2 placeholder-slate-400 focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm transition-colors`}
                                            placeholder="Acme Corp"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Industry</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Briefcase className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            name="industry"
                                            type="text"
                                            value={formData.industry}
                                            onChange={handleInputChange}
                                            className={`block w-full pl-10 rounded-lg border ${errors.industry ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} px-3 py-2 placeholder-slate-400 focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm transition-colors`}
                                            placeholder="e.g. Technology, Finance"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Common Fields */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                {role === 'company' ? 'Work Email' : 'Email Address'}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`block w-full pl-10 rounded-lg border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} px-3 py-2 placeholder-slate-400 focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm transition-colors`}
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`block w-full pl-10 rounded-lg border ${errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} px-3 py-2 placeholder-slate-400 focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm transition-colors`}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`block w-full pl-10 rounded-lg border ${errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'} px-3 py-2 placeholder-slate-400 focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm transition-colors`}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-bold text-primary shadow-sm hover:bg-secondary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-all hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                                {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-2 text-center text-sm text-slate-300">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-white hover:text-slate-200 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
