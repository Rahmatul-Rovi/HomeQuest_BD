import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { isVerificationImageUrl } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const ID_TYPES = ["NID", "PASSPORT", "DRIVING_LICENSE"] as const;
type IdType = (typeof ID_TYPES)[number];

const ID_LABELS: Record<IdType, string> = {
  NID: "NID",
  PASSPORT: "Passport",
  DRIVING_LICENSE: "Driving License",
};

const ID_NUMBER_HINTS: Record<IdType, string> = {
  NID: "NID number must be 10, 13 or 17 digits.",
  PASSPORT: "Passport number must be 6-9 letters/digits.",
  DRIVING_LICENSE: "License number must be 8-20 letters/digits.",
};

function normalizeIdNumber(type: IdType, raw: string): string | null {
  const value = raw.replace(/[\s-]/g, "");
  if (type === "NID") return /^(\d{10}|\d{13}|\d{17})$/.test(value) ? value : null;
  if (type === "PASSPORT") {
    return /^[A-Za-z0-9]{6,9}$/.test(value) ? value.toUpperCase() : null;
  }
  return /^[A-Za-z0-9]{8,20}$/.test(value) ? value.toUpperCase() : null;
}