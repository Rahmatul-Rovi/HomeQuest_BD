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

  useEffect(() => {
    if (status !== "authenticated") return;

    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        setConversations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full animate-pulse space-y-3">
          <div className="h-16 bg-gray-100 rounded-xl" />
          <div className="h-16 bg-gray-100 rounded-xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-10 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Messages</h1>
        <p className="text-gray-500 text-sm mb-8">
          Your conversations with tenants and owners.
        </p>

        {conversations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <MessageCircleMore size={36} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No conversations yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Start a chat from any property listing page.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => {
              const isOwner = conv.owner.id === session?.user?.id;
              const otherUser = isOwner ? conv.tenant : conv.owner;
              const lastMessage = conv.messages[0];

              return (
                <Link
                  key={conv.id}
                  href={`/messages/${conv.id}`}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition"
                >
                  {otherUser.image ? (
                    <Image
                      src={otherUser.image}
                      alt={otherUser.name}
                      width={44}
                      height={44}
                      className="rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold shrink-0">
                      {otherUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {otherUser.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{conv.listing.title}</p>
                    {lastMessage && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {lastMessage.text}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}