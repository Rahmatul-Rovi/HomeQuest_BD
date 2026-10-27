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