"use client";

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Check, X as XIcon, Clock, Phone, Mail, Inbox } from "lucide-react";

type Status = "PENDING" | "APPROVED" | "REJECTED";
type Tab = Status | "ALL";

type VerificationItem = {
  id: string;
  idType: "NID" | "PASSPORT" | "DRIVING_LICENSE";
  idNumber: string;
  frontImage: string;
  backImage: string | null;
  status: Status;
  adminNote: string | null;
  reviewedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
    role: string;
    verified: boolean;
  };
};
