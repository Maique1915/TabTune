'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@/modules/core/presentation/context/user-context';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export function MiniChat() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [admin, setAdmin] = useState<any>(null);
    const [conversation, setConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchAdmin = useCallback(async () => {
        try {
            const res = await fetch('/api/chat/admin');
            if (res.ok) {
                const data = await res.json();
                setAdmin(data);
            }
        } catch (err) {
            console.error('Failed to fetch admin:', err);
        }
    }, []);

    const setupConversation = useCallback(async () => {
        if (!user || !admin) return;
        try {
            const res = await fetch('/api/chat/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userOneId: user.id, userTwoId: admin.id })
            });
            if (res.ok) {
                const data = await res.json();
                setConversation(data);
            }
        } catch (err) {
            console.error('Failed to setup conversation:', err);
        }
    }, [user, admin]);

    const fetchMessages = useCallback(async () => {
        if (!conversation) return;
        try {
            const res = await fetch(`/api/chat/messages?conversationId=${conversation.id}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    }, [conversation]);

    useEffect(() => {
        if (isOpen && !admin) {
            const timer = setTimeout(() => {
                void fetchAdmin();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen, admin, fetchAdmin]);

    useEffect(() => {
        if (admin && user) {
            const timer = setTimeout(() => {
                void setupConversation();
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [admin, user, setupConversation]);

    useEffect(() => {
        if (conversation) {
            const timer = setTimeout(() => {
                void fetchMessages();
            }, 0);
            const interval = setInterval(() => {
                void fetchMessages();
            }, 3000); // Poll every 3s
            return () => {
                clearTimeout(timer);
                clearInterval(interval);
            };
        }
    }, [conversation, fetchMessages]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversation || !user) return;

        const content = newMessage;
        setNewMessage('');

        try {
            const res = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: conversation.id,
                    senderId: user.id,
                    content
                })
            });
            if (res.ok) {
                fetchMessages();
            }
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {isOpen && (
                <div className="w-80 h-[450px] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                    {/* Header */}
                    <div className="p-4 bg-primary/10 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="size-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white leading-none">{admin?.name || 'Support Admin'}</p>
                                <p className="text-[10px] text-primary uppercase font-black tracking-widest mt-1">Admin Support</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        className="flex-1 overflow-y-auto p-4 scroll-smooth"
                        ref={scrollRef}
                    >
                        <div className="flex flex-col gap-3">
                            {messages.length === 0 ? (
                                <div className="py-10 text-center">
                                    <p className="text-zinc-500 text-xs italic">Start a conversation with our admin.</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div
                                        key={msg.id}
                                        className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.senderId === user.id
                                            ? 'bg-primary text-[#0f2023] self-end rounded-tr-none'
                                            : 'bg-zinc-800 text-white self-start rounded-tl-none'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900/50 border-t border-white/5 flex gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="bg-black/20 border-white/10 text-xs h-10"
                        />
                        <Button type="submit" size="icon" className="shrink-0 size-10 bg-primary hover:bg-primary/90">
                            <Send size={16} className="text-[#0f2023]" />
                        </Button>
                    </form>
                </div>
            )}

            {/* FAB */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`size-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-zinc-800 rotate-90' : 'bg-primary'
                    }`}
            >
                {isOpen ? (
                    <X size={24} className="text-white" />
                ) : (
                    <MessageCircle size={24} className="text-[#0f2023]" />
                )}
            </button>
        </div>
    );
}
