import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { VERIFICATION_FOLDER, signUploadParams } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!apiKey || !cloudName || !process.env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: "Document upload is not configured on the server." },
      { status: 500 }
    );
  }

  const userId = session.user.id;
  const [user, pending] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { verified: true } }),
    prisma.verificationRequest.findFirst({
      where: { userId, status: "PENDING" },
      select: { id: true },
    }),
  ]);