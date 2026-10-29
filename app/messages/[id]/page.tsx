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