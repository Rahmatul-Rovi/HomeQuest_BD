import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { isVerificationImageUrl } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

const ID_TYPES = ["NID", "PASSPORT", "DRIVING_LICENSE"] as const;
type IdType = (typeof ID_TYPES)[number];
