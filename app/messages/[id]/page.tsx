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
