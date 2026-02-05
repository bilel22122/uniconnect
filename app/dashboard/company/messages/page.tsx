'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Loader2, User, MessageSquare, ArrowRight } from 'lucide-react';

type Conversation = {
    id: string;
    student: {
        full_name: string;
        photo_url: string | null;
    };
    unread_count?: number;
};

export default function CompanyInboxPage() {
    const supabase = createClient();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch conversations with messages to calculate unread count manually
                const { data, error } = await supabase
                    .from('conversations')
                    .select(`
                        id,
                        created_at,
                        student:profiles!student_id(full_name, photo_url),
                        messages(id, is_read, sender_id)
                    `)
                    .eq('company_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                console.log('Inbox Data (Company):', data);

                // Calculate unread count for each conversation
                const conversationsWithCount = (data as any).map((convo: any) => {
                    const unread = convo.messages?.filter((m: any) => !m.is_read && m.sender_id !== user.id).length || 0;
                    return {
                        ...convo,
                        unread_count: unread,
                        // Ensure we have a fallback for the name
                        student: convo.student || { full_name: 'Unknown Student', photo_url: null }
                    };
                });

                setConversations(conversationsWithCount);

            } catch (err) {
                console.error("Error fetching conversations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-64px)] justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Messages</h1>

            {conversations.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-500">
                        Start conversations with candidates from the Candidates page.
                    </p>
                    <Link href="/dashboard/company/candidates" className="text-blue-600 hover:underline mt-2 inline-block">
                        Go to Candidates
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {conversations.map((convo) => (
                        <Link
                            key={convo.id}
                            href={`/dashboard/company/messages/${convo.id}`}
                            className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 flex-shrink-0">
                                    {convo.student?.photo_url ? (
                                        <img src={convo.student.photo_url} alt={convo.student.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                            {convo.student?.full_name || 'Student'}
                                        </h3>
                                        {convo.unread_count !== undefined && convo.unread_count > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                +{convo.unread_count}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm truncate ${convo.unread_count !== undefined && convo.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                        {convo.unread_count !== undefined && convo.unread_count > 0 ? 'New messages awaiting reply' : 'Click to view conversation'}
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
