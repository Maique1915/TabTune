"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Send, User } from "lucide-react";
import { useUser } from "@/modules/core/presentation/context/user-context";

interface Message {
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    isRead: boolean;
    createdAt: string;
}

interface ChatScreenProps {
    className?: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ className = "" }) => {
    const { user } = useUser();
    const [admin, setAdmin] = useState<any>(null);
    const [conversation, setConversation] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch admin on mount
    useEffect(() => {
        fetchAdmin();
    }, []);

    // Setup conversation when admin and user are available
    useEffect(() => {
        if (admin && user) {
            setupConversation();
        }
    }, [admin, user]);

    // Poll for new messages
    useEffect(() => {
        if (conversation) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000); // Poll every 3s
            return () => clearInterval(interval);
        }
    }, [conversation]);

    const fetchAdmin = async () => {
        try {
            const res = await fetch("/api/chat/admin");
            if (res.ok) {
                const data = await res.json();
                setAdmin(data);
            }
        } catch (err) {
            console.error("Failed to fetch admin:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const setupConversation = async () => {
        if (!user || !admin) return;
        try {
            const res = await fetch("/api/chat/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userOneId: user.id, userTwoId: admin.id }),
            });
            if (res.ok) {
                const data = await res.json();
                setConversation(data);
            }
        } catch (err) {
            console.error("Failed to setup conversation:", err);
        }
    };

    const fetchMessages = async () => {
        if (!conversation) return;
        try {
            const res = await fetch(
                `/api/chat/messages?conversationId=${conversation.id}`
            );
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !conversation || !user) return;

        const content = newMessage;
        setNewMessage("");

        try {
            const res = await fetch("/api/chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId: conversation.id,
                    senderId: user.id,
                    content,
                }),
            });
            if (res.ok) {
                fetchMessages();
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    if (isLoading) {
        return (
            <Card className={`w-full h-[600px] flex items-center justify-center bg-[#162a2d]/60 backdrop-blur-md border-white/5 ${className}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-zinc-400 text-sm">Loading chat...</p>
                </div>
            </Card>
        );
    }

    if (!admin) {
        return (
            <Card className={`w-full h-[600px] flex items-center justify-center bg-[#162a2d]/60 backdrop-blur-md border-white/5 ${className}`}>
                <div className="text-center">
                    <p className="text-zinc-400 text-sm">Admin not available</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className={`w-full h-[600px] flex flex-col rounded-2xl bg-[#162a2d]/60 backdrop-blur-md border-white/5 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-[#162a2d]/80">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="font-semibold text-sm text-white">{admin.name}</p>
                    <span className="text-xs text-primary uppercase font-black tracking-widest">
                        Admin Support
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-black/10">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-zinc-500 text-sm italic">
                            Start a conversation with our admin team
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${msg.senderId === user?.id ? "justify-end" : "justify-start"
                                }`}
                        >
                            {msg.senderId !== user?.id && (
                                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs shrink-0">
                                    {admin.name?.charAt(0) || "A"}
                                </div>
                            )}

                            <div
                                className={`px-3 py-2 rounded-lg text-sm max-w-xs break-words transition-all duration-200 hover:scale-[1.02] ${msg.senderId === user?.id
                                        ? "bg-primary text-[#0f2023] rounded-br-none"
                                        : "bg-white/5 text-white border border-white/10 rounded-bl-none"
                                    }`}
                            >
                                {msg.content}
                            </div>

                            {msg.senderId === user?.id && (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[#0f2023] text-xs font-bold shrink-0">
                                    {user.name?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>
                    ))
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5 flex gap-2 bg-[#162a2d]/80">
                <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendMessage();
                    }}
                    className="bg-black/20 border-white/10 text-white placeholder:text-zinc-500"
                />
                <Button
                    onClick={sendMessage}
                    className="shrink-0 rounded-full bg-primary hover:bg-primary/90 text-[#0f2023]"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </Card>
    );
};

export default ChatScreen;
