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

  if (user?.verified) {
    return NextResponse.json({ error: "Your account is already verified." }, { status: 400 });
  }
  if (pending) {
    return NextResponse.json(
      { error: "You already have a request under review." },
      { status: 400 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const type = "authenticated";
  const signature = signUploadParams({ folder: VERIFICATION_FOLDER, timestamp, type });

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder: VERIFICATION_FOLDER,
    type,
  });
}