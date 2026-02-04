'use client';

import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold tracking-tight text-blue-900">UniConnect</span>
                    </Link>
                    {/* Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Find Talent</Link>
                        <Link href="#" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Find Work</Link>
                    </div>
                    {/* Buttons */}
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-slate-700 hover:text-blue-600 font-medium px-4 py-2 transition-colors">
                            Login
                        </Link>
                        <Link href="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
