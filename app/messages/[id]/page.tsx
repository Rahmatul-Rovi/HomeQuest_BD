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