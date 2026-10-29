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
