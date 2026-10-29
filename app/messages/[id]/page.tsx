"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
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

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const conversationId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/messages/${conversationId}`);
    }
  }, [status, router, conversationId]);

  const loadMessages = async () => {
    const res = await fetch(`/api/conversations/${conversationId}/messages`);
    if (res.ok) setMessages(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    if (status !== "authenticated") return;
    loadMessages();

     const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [status, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[60vh] min-h-[400px]">
            {messages.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-10">
                Say hello and start the conversation!
              </p>
            ) : (