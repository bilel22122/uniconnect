'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { User, Send, ArrowLeft, Loader2, Building2 } from 'lucide-react';
import Link from 'next/link';

type Message = {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
};

type Profile = {
    id: string;
    full_name: string;
    photo_url: string | null;
};

export default function StudentChatPage() {
    const params = useParams();
    const conversationId = params.conversationId as string;
    const supabase = createClient();

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [company, setCompany] = useState<Profile | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Get Current User
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                setCurrentUserId(user.id);

                // 2. Get Conversation Details (Company info)
                const { data: conversationData, error: convoError } = await supabase
                    .from('conversations')
                    .select(`
                        id,
                        company_id,
                        company:profiles!company_id(id, full_name, photo_url)
                    `)
                    .eq('id', conversationId)
                    .single();

                if (convoError) throw convoError;

                if (conversationData && conversationData.company) {
                    setCompany(conversationData.company as unknown as Profile);
                }

                // 3. Get Messages
                const { data: messagesData, error: msgError } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('conversation_id', conversationId)
                    .order('created_at', { ascending: true });

                if (msgError) throw msgError;
                console.log('Fetched messages:', messagesData);
                setMessages(messagesData || []);

                // 4. Mark as Read
                if (user) {
                    await supabase
                        .from('messages')
                        .update({ is_read: true })
                        .eq('conversation_id', conversationId)
                        .neq('sender_id', user.id)
                        .eq('is_read', false);
                }

            } catch (err) {
                console.error("Error fetching chat data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();

        // 5. Real-time Subscription
        const channel = supabase
            .channel(`conversation:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                async (payload) => {
                    const newMsg = payload.new as Message;

                    // Ignore own messages as they are optimistically added
                    if (currentUserId && newMsg.sender_id === currentUserId) return;

                    // Mark new incoming message as read immediately
                    if (currentUserId) {
                        await supabase
                            .from('messages')
                            .update({ is_read: true })
                            .eq('id', newMsg.id);
                    }

                    setMessages((prev) => {
                        if (prev.some((msg) => msg.id === newMsg.id)) {
                            return prev;
                        }
                        return [...prev, newMsg];
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, supabase, currentUserId]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !currentUserId) return;

        const text = newMessage.trim();
        setNewMessage(''); // optimistic clear

        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conversationId,
                    sender_id: currentUserId,
                    content: text
                });

            if (error) {
                console.error("Error sending message:", error);
            } else {
                setMessages((prev) => [...prev, {
                    id: Math.random().toString(),
                    conversation_id: conversationId,
                    content: text,
                    sender_id: currentUserId,
                    created_at: new Date().toISOString()
                }]);
            }
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-64px)] justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-white">
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-white z-10">
                <Link href="/dashboard/student/messages" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                    {company?.photo_url ? (
                        <img src={company.photo_url} alt={company.full_name} className="w-full h-full object-cover" />
                    ) : (
                        <Building2 className="w-5 h-5 text-gray-400" />
                    )}
                </div>

                <div>
                    <h2 className="font-bold text-gray-900">{company?.full_name || 'Company'}</h2>
                    <p className="text-xs text-gray-500">Messaging</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p>No messages yet.</p>
                        <p className="text-sm">Say hello to start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === currentUserId;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${isMe
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-secondary' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 max-w-4xl mx-auto"
                >
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-secondary/20 text-gray-800 placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
                    >
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
}
