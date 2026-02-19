'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    LayoutDashboard,
    Search,
    FileText,
    MessageSquare,
    LogOut,
    User,
    Bell
} from 'lucide-react';

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const links = [
        { name: 'Find Work', href: '/dashboard/student/jobs', icon: Search },
        { name: 'Companies', href: '/dashboard/student/companies', icon: LayoutDashboard }, // Using LayoutDashboard as generic icon for companies list 
        { name: 'My Applications', href: '/dashboard/student/applications', icon: FileText },
        { name: 'Messages', href: '/dashboard/student/messages', icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navbar */}
            <header className="sticky top-0 z-50 w-full bg-primary shadow-md">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/dashboard/student" className="flex-shrink-0">
                        <Image
                            src="/logo1.png"
                            alt="Apprenticeship"
                            width={150}
                            height={40}
                            className="h-10 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {links.map((link) => {
                            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors ${isActive
                                        ? 'text-secondary'
                                        : 'text-white hover:text-secondary'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/student/profile" className="text-white hover:text-secondary p-2 rounded-full hover:bg-white/10 transition-all">
                            <User className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-secondary border border-secondary rounded-full hover:bg-secondary hover:text-primary transition-all"
                        >
                            <LogOut className="w-3 h-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
