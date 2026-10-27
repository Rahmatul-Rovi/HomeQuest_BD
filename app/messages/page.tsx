"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MessageCircleMore } from "lucide-react";

type Conversation = {
  id: string;
  listing: { title: string; images: string[] };
  tenant: { id: string; name: string; image: string | null };
  owner: { id: string; name: string; image: string | null };
  messages: { text: string; createdAt: string }[];
};

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/messages");
    }
  }, [status, router]);