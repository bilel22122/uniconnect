'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    Home,
    Building2,
    Briefcase,
    Bell,
    User,
    Users,
    PlusCircle,
    List,
    Search,
    GraduationCap,
    LogOut,
    MessageSquare
} from 'lucide-react';

interface NavLink {
    name: string;
    href: string;
    icon: any;
    hasBadge?: boolean;
    isMessaging?: boolean;
}

interface TopNavProps {
    role: 'student' | 'company';
}

export default function TopNav({ role }: TopNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        const checkUnread = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { count } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('is_read', false)
                .neq('sender_id', user.id);

            setHasUnread(count !== null && count > 0);
        };

        checkUnread();

        // Optional: Realtime subscription for unread count could go here
        const channel = supabase
            .channel('unread_messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
                checkUnread();
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, () => {
                checkUnread();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const studentLinks: NavLink[] = [
        { name: 'Home', href: '/dashboard/student', icon: Home },
        { name: 'Companies', href: '/dashboard/student/companies', icon: Building2 },
        { name: 'Jobs', href: '/dashboard/student/jobs', icon: Briefcase },
        { name: 'Messaging', href: '/dashboard/student/messages', icon: MessageSquare, isMessaging: true }, // Updated href slightly to likely root
        // { name: 'Notifications', href: '/dashboard/student/notifications', icon: Bell, hasBadge: true },
        { name: 'Me', href: '/dashboard/student/profile', icon: User },
    ];

    const companyLinks: NavLink[] = [
        { name: 'Home', href: '/dashboard/company', icon: Home },
        { name: 'Candidates', href: '/dashboard/company/candidates', icon: Users },
        { name: 'Messaging', href: '/dashboard/company/messages', icon: MessageSquare, isMessaging: true }, // Updated href slightly to likely root
        { name: 'Post Job', href: '/dashboard/company/listings', icon: PlusCircle },
        { name: 'Me', href: '/dashboard/company/profile', icon: User },
    ];

    const links = role === 'student' ? studentLinks : companyLinks;

    return (
        <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between h-full">
                    {/* Left Side: Logo + Search */}
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link href={role === 'student' ? '/dashboard/student' : '/dashboard/company'} className="flex items-center gap-2">
                            <GraduationCap className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-blue-900 hidden md:block">UniConnect</span>
                        </Link>

                        {/* Search Placeholder */}
                        <div className="hidden md:flex items-center bg-gray-100 rounded-md px-3 py-1.5 w-64">
                            <Search className="h-4 w-4 text-gray-500 mr-2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-700 placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Right Side: Navigation Links */}
                    <div className="flex items-center space-x-1 sm:space-x-4 md:space-x-8">
                        {links.map((link) => {
                            const Icon = link.icon;
                            // Check active state more loosely to account for sub-pages
                            const isActive = pathname === link.href || (link.href !== '/dashboard/student' && link.href !== '/dashboard/company' && pathname?.startsWith(link.href));

                            // Exact match for home to avoid it being active on all subpages
                            const isHome = (link.href === '/dashboard/student' || link.href === '/dashboard/company') && pathname === link.href;

                            const activeState = link.name === 'Home' ? isHome : isActive;

                            // Determine icon color
                            let iconColorClass = 'text-gray-500 group-hover:text-black';
                            if (activeState) {
                                iconColorClass = 'text-black';
                            } else if (link.isMessaging && hasUnread) {
                                iconColorClass = 'text-green-600';
                            }


                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="flex flex-col items-center justify-center p-1 group relative min-w-[3.5rem]"
                                >
                                    <div className="relative">
                                        <Icon
                                            className={`h-6 w-6 transition-colors duration-200 ${iconColorClass}`}
                                            strokeWidth={1.5}
                                        />
                                        {link.hasBadge && (
                                            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] mt-0.5 transition-colors duration-200 ${activeState ? 'text-black font-medium' : 'text-gray-500 group-hover:text-black'
                                        }`}>
                                        {link.name}
                                    </span>

                                    {/* Active Indicator Bar (LinkedIn style) */}
                                    {activeState && (
                                        <span className="absolute bottom-[-16px] left-0 w-full h-[2px] bg-black"></span>
                                    )}
                                </Link>
                            );
                        })}

                        {/* Sign Out Button */}
                        <button
                            onClick={handleSignOut}
                            className="flex flex-col items-center justify-center p-1 group relative min-w-[3.5rem]"
                        >
                            <div className="relative">
                                <LogOut
                                    className="h-6 w-6 text-gray-500 transition-colors duration-200 group-hover:text-red-600"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <span className="text-[10px] mt-0.5 text-gray-500 transition-colors duration-200 group-hover:text-red-600">
                                Sign Out
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
