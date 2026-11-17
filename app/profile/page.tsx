"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";
import {
  Camera,
  BadgeCheck,
  Mail,
  Phone,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Home,
  CalendarCheck,
  Heart,
  LayoutDashboard,
  MessageCircleMore,
  Bell,
  ShieldCheck,
  Trash2,
} from "lucide-react";
