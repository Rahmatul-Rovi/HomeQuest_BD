"use client";

import { useEffect, useState, useCallback, type ElementType } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Bell,
  BellOff,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Ban,
  BadgeCheck,
  ShieldAlert,
  Trash2,
  CheckCheck,
} from "lucide-react";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};