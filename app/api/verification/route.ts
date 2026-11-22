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

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user, latest] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { verified: true },
    }),
    prisma.verificationRequest.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    verified: Boolean(user?.verified),
    request: latest
     ? {
          id: latest.id,
          idType: latest.idType,
          idNumberMasked: `•••• ${latest.idNumber.slice(-4)}`,
          status: latest.status,
          adminNote: latest.adminNote,
          createdAt: latest.createdAt,
          reviewedAt: latest.reviewedAt,
        }
      : null,
  });
}

// POST - Notun verification request submit
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const body = await req.json();

  const idType = body.idType as IdType;
  if (!ID_TYPES.includes(idType)) {
    return NextResponse.json({ error: "Invalid ID type" }, { status: 400 });
  }

  const idNumber = normalizeIdNumber(idType, String(body.idNumber ?? ""));
  if (!idNumber) {
    return NextResponse.json({ error: ID_NUMBER_HINTS[idType] }, { status: 400 });
  }

   if (!isVerificationImageUrl(body.frontImage)) {
    return NextResponse.json(
      { error: "Please upload the front photo of your ID." },
      { status: 400 }
    );
  }

  let backImage: string | null = null;
  if (idType !== "PASSPORT") {
    if (!isVerificationImageUrl(body.backImage)) {
      return NextResponse.json(
        { error: "Please upload the back photo of your ID." },
        { status: 400 }
      );
    }
    backImage = body.backImage;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, verified: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (user.verified) {
    return NextResponse.json({ error: "Your account is already verified." }, { status: 400 });
  }

  const pending = await prisma.verificationRequest.findFirst({
    where: { userId, status: "PENDING" },
    select: { id: true },
  });
  if (pending) {
    return NextResponse.json(
      { error: "You already have a request under review." },
      { status: 409 }
    );
  }

  const created = await prisma.verificationRequest.create({
    data: {
      userId,
      idType,
      idNumber,
      frontImage: body.frontImage,
      backImage,
    },
  });

  // Shob admin ke notify kora
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  await Promise.all(
    admins.map((admin) =>
      createNotification({
        userId: admin.id,
        type: "VERIFICATION_SUBMITTED",
        title: "New verification request",
        body: `${user.name} submitted a ${ID_LABELS[idType]} for verification.`,
        link: "/admin/verifications",