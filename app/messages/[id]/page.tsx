"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Send } from "lucide-react";

type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
  sender: { id: string; name: string };
};

type ConversationInfo = {
  id: string;
  listing: { title: string };
  tenant: { id: string; name: string; image: string | null };
  owner: { id: string; name: string; image: string | null };
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const conversationId = params.id as string;

  const [conversation, setConversation] = useState<ConversationInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true); // User default e niche thake dhore nicchi

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/messages/${conversationId}`);
    }
  }, [status, router, conversationId]);

   const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const threshold = 80; // niche theke eituku pixel er moddhe thakle "near bottom" dhora hobe
    isNearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Age shudhu message load, ekhon conversation info-o load kore
  const loadData = useCallback(async () => {
    const [convRes, msgRes] = await Promise.all([
      fetch(`/api/conversations/${conversationId}`),
      fetch(`/api/conversations/${conversationId}/messages`),
    ]);

    if (convRes.ok) setConversation(await convRes.json());
    if (msgRes.ok) setMessages(await msgRes.json());

    setLoading(false);
  }, [conversationId]);

  // Polling — shudhu message refresh kore, scroll force kore na
  const refreshMessages = useCallback(async () => {
    const res = await fetch(`/api/conversations/${conversationId}/messages`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data);
    }
  }, [conversationId]);

  useEffect(() => {
    if (status !== "authenticated") return;
    loadData();

    const interval = setInterval(refreshMessages, 4000);
    return () => clearInterval(interval);
  }, [status, loadData, refreshMessages]);

  // Prothom load e, ar user already niche thakle-i shudhu auto-scroll
  useEffect(() => {
    if (messages.length === 0) return;
    if (isNearBottomRef.current) {
      scrollToBottom();
    }
  }, [messages]);

   const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);

    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (res.ok) {
      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
      setText("");
      isNearBottomRef.current = true; // Nijer message pathale shobshomoy niche jabe
      setTimeout(scrollToBottom, 50);
    }
    setSending(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full animate-pulse">
          <div className="h-96 bg-gray-100 rounded-2xl" />
        </div>
        <Footer />
      </div>
    );
  }

    const otherUser =
    conversation && conversation.owner.id === session?.user?.id
      ? conversation.tenant
      : conversation?.owner;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-6 w-full flex flex-col">
        <Link
          href="/messages"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary mb-4 w-fit"
        >
          <ArrowLeft size={16} /> Back to Messages
        </Link>

        <div className="flex-1 bg-white border border-gray-100 rounded-2xl flex flex-col overflow-hidden">
          {/* Chat Header — Onno user er pic + naam */}
          {otherUser && (
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              {otherUser.image ? (
                <Image
                  src={otherUser.image}
                  alt={otherUser.name}
                  width={38}
                  height={38}
                  className="rounded-full object-cover"
                />
              ) : (

                  <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">
                  {otherUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {otherUser.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {conversation?.listing.title}
                </p>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[55vh] min-h-[400px]"
          >
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">
                Say hello and start the conversation!
              </p>
            ) : (
                  messages.map((msg) => {
                const isMe = msg.senderId === session?.user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
