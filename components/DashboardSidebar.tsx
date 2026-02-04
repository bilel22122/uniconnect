'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Search,
    FileText,
    User,
    PlusCircle,
    List,
    Users,
    LogOut,
    GraduationCap,
    Building2,
    Bell
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const isStudent = pathname?.includes('/student');
    const isCompany = pathname?.includes('/company');

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const studentLinks = [
        { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
        { name: 'Find Work', href: '/dashboard/student/jobs', icon: Search },
        { name: 'Companies', href: '/dashboard/student/companies', icon: Building2 },
        { name: 'My Applications', href: '/dashboard/student/applications', icon: FileText },
        { name: 'Notifications', href: '/dashboard/student/notifications', icon: Bell },
        { name: 'Profile', href: '/dashboard/student/profile', icon: User },
    ];

    const companyLinks = [
        { name: 'Overview', href: '/dashboard/company', icon: LayoutDashboard },
        { name: 'Post a Job', href: '/dashboard/company/post-job', icon: PlusCircle },
        { name: 'My Listings', href: '/dashboard/company/listings', icon: List },
        { name: 'Candidates', href: '/dashboard/company/candidates', icon: Users },
        { name: 'Company Profile', href: '/dashboard/company/profile', icon: User }, // Added Profile Link
    ];

    const links = isStudent ? studentLinks : isCompany ? companyLinks : [];

    if (!isStudent && !isCompany) return null; // Or return a default

    return (
        <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
                <Link href="/" className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                    <span className="text-xl font-bold text-blue-900">UniConnect</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Sign Out */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
