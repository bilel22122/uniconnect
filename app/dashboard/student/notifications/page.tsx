'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Bell, Check, Clock, ChevronRight, Loader2, Inbox } from 'lucide-react';

type Notification = {
    id: string;
    title: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
};

export default function NotificationsPage() {
    const supabase = createClient();
    const router = useRouter();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }

                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setNotifications(data || []);
            } catch (err) {
                console.error('Error fetching notifications:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();

        // subscription for real-time could go here
    }, [supabase, router]);

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.is_read) {
            // Mark as read in background
            try {
                await supabase
                    .from('notifications')
                    .update({ is_read: true })
                    .eq('id', notif.id);

                // Update local state
                setNotifications(prev => prev.map(n =>
                    n.id === notif.id ? { ...n, is_read: true } : n
                ));
            } catch (err) {
                console.error("Error marking read:", err);
            }
        }

        if (notif.link) {
            router.push(notif.link);
        }
    };

    const markAllAsRead = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id);

            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

        } catch (err) {
            console.error("Error marking all read:", err);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pb-20">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
                    <p className="text-slate-500 mt-1">Stay updated on your applications and activity.</p>
                </div>
                {notifications.some(n => !n.is_read) && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                        <Check className="w-4 h-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* List */}
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">You're all caught up!</h3>
                        <p className="text-slate-500 mt-1">No new notifications at the moment.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`
                        relative group flex items-start gap-4 p-5 rounded-xl border transition-all cursor-pointer
                        ${notif.is_read
                                    ? 'bg-white border-slate-200 hover:border-blue-200'
                                    : 'bg-blue-50/50 border-blue-100 hover:border-blue-300'
                                }
                    `}
                        >
                            {/* Unread Indicator */}
                            {!notif.is_read && (
                                <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-blue-600 rounded-full shadow-sm ring-4 ring-blue-50/50"></div>
                            )}

                            {/* Icon */}
                            <div className={`
                        p-3 rounded-full flex-shrink-0
                        ${notif.is_read ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}
                    `}>
                                <Inbox className="w-5 h-5" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pr-8">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className={`text-base font-semibold ${notif.is_read ? 'text-slate-800' : 'text-slate-900'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-xs font-medium text-slate-400 flex-shrink-0 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(notif.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <p className={`text-sm ${notif.is_read ? 'text-slate-500' : 'text-slate-600'}`}>
                                    {notif.message}
                                </p>
                            </div>

                            {/* Chevron (subtle) */}
                            <div className="self-center text-slate-300 group-hover:text-blue-400 transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
