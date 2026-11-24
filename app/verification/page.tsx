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

const ID_LABELS: Record<IdType, string> = {
  NID: "NID",
  PASSPORT: "Passport",
  DRIVING_LICENSE: "Driving License",
};

async function uploadPrivateImage(file: File): Promise<string> {
  const signRes = await fetch("/api/verification/sign", { method: "POST" });
  const sign = await signRes.json();
  if (!signRes.ok) throw new Error(sign.error || "Could not start the upload.");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sign.apiKey);
  formData.append("timestamp", String(sign.timestamp));
  formData.append("signature", sign.signature);
  formData.append("folder", sign.folder);
  formData.append("type", sign.type);