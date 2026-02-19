'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User, LogOut } from 'lucide-react';

export default function CompanyNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard/company' },
        { name: 'Post a Job', href: '/dashboard/company/listings' }, // Assuming listings is the place to manage jobs based on folder structure
        { name: 'Candidates', href: '/dashboard/company/candidates' },
        { name: 'Messages', href: '/dashboard/company/messages' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0B1C38] shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo */}
                <Link href="/dashboard/company" className="flex-shrink-0">
                    <Image
                        src="/logo1.png"
                        alt="Apprenticeship"
                        width={120}
                        height={40}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/dashboard/company' && pathname?.startsWith(link.href));

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${isActive
                                        ? 'text-[#FBBF24]'
                                        : 'text-white hover:text-[#FBBF24]'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/company/profile"
                        className="text-white hover:text-[#FBBF24] transition-colors"
                        title="My Profile"
                    >
                        <User className="w-6 h-6" />
                    </Link>

                    <button
                        onClick={handleSignOut}
                        className="border border-[#FBBF24] text-[#FBBF24] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#FBBF24] hover:text-[#0B1C38] transition-all flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                    </button>
                </div>

            </div>
        </nav>
    );
}
