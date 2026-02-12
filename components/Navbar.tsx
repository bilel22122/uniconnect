'use client';

import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-primary/95 backdrop-blur-md border-b border-white/10 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center">
                        <Image
                            src="/logo1.png"
                            alt="Apprenticeship Logo"
                            width={180}
                            height={60}
                            className="h-12 w-auto object-contain"
                            priority
                        />
                    </Link>
                    {/* Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/jobs" className="text-gray-300 hover:text-white font-medium transition-colors">Find Talent</Link>
                        <Link href="/jobs" className="text-gray-300 hover:text-white font-medium transition-colors">Find Apprenticeships</Link>
                    </div>
                    {/* Buttons */}
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-white hover:text-secondary font-medium px-4 py-2 transition-colors">
                            Login
                        </Link>
                        <Link href="/register" className="bg-secondary text-primary px-5 py-2.5 rounded-full font-bold hover:bg-secondary/90 transition-all shadow-sm hover:shadow-md">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
