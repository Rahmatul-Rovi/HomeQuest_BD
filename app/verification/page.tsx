"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import {
  BadgeCheck,
  ShieldCheck,
  Clock,
  XCircle,
  Lock,
  UploadCloud,
  Loader2,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

type IdType = "NID" | "PASSPORT" | "DRIVING_LICENSE";

type VerificationInfo = {
  verified: boolean;
  request: null | {
    id: string;
    idType: IdType;
    idNumberMasked: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    adminNote: string | null;
    createdAt: string;
    reviewedAt: string | null;
  };
};


const ID_OPTIONS: { value: IdType; label: string; hasBack: boolean; placeholder: string }[] = [
  { value: "NID", label: "National ID (NID)", hasBack: true, placeholder: "10, 13 or 17 digit NID number" },
  { value: "PASSPORT", label: "Passport", hasBack: false, placeholder: "Passport number" },
  { value: "DRIVING_LICENSE", label: "Driving License", hasBack: true, placeholder: "License number" },
];