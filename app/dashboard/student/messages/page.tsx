'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Building2, MessageSquare, ArrowRight } from 'lucide-react';

type Conversation = {
    id: string;
    company: {
        company_name: string;
        photo_url: string | null;
    };
    unread_count?: number;
    last_message_subtitle?: string;
};

export default function StudentInboxPage() {
    const supabase = createClient();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch conversations with messages to calculate unread count and get last message
                // Fetch company_name for company profile
                const { data, error } = await supabase
                    .from('conversations')
                    .select(`
                        id,
                        created_at,
                        company:profiles!company_id(company_name, photo_url),
                        messages(id, content, is_read, sender_id, created_at)
                    `)
                    .eq('student_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                console.log('Inbox Data (Student):', data);

                // Calculate unread count and get last message for each conversation
                const conversationsWithDetails = (data as any).map((convo: any) => {
                    const messages = convo.messages || [];
                    const unread = messages.filter((m: any) => !m.is_read && m.sender_id !== user.id).length || 0;

                    // Find latest message (messages might not be ordered by created_at in the subquery by default, so sort)
                    const sortedMessages = [...messages].sort((a: any, b: any) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    );
                    const lastMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;

                    let subtitle = 'No messages yet';
                    if (lastMessage) {
                        const isMe = lastMessage.sender_id === user.id;
                        // Truncate logic
                        let content = lastMessage.content || '';
                        if (content.length > 50) {
                            content = content.substring(0, 50) + '...';
                        }

                        subtitle = isMe ? `You: ${content}` : content;
                    }

                    return {
                        ...convo,
                        unread_count: unread,
                        last_message_subtitle: subtitle,
                        // Ensure we have a fallback for the name, checking company_name
                        company: convo.company || { company_name: 'Unknown Company', photo_url: null }
                    };
                });

                setConversations(conversationsWithDetails);

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
                        When companies contact you, your conversations will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {conversations.map((convo) => (
                        <Link
                            key={convo.id}
                            href={`/dashboard/student/messages/${convo.id}`}
                            className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 flex-shrink-0">
                                    {convo.company?.photo_url ? (
                                        <img src={convo.company.photo_url} alt={convo.company.company_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                            {convo.company?.company_name || 'Company'}
                                        </h3>
                                        {convo.unread_count !== undefined && convo.unread_count > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                +{convo.unread_count}
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-sm truncate ${convo.unread_count !== undefined && convo.unread_count > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                        {convo.last_message_subtitle || 'No messages yet'}
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
