"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Users,
  Home,
  ShieldCheck,
  CalendarCheck,
  BadgeCheck,
  Trash2,
  ShieldAlert,
} from "lucide-react";

type Stats = {
  totalUsers: number;
  totalListings: number;
  pendingVerifications: number;
  totalVisits: number;
};