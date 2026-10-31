import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ count: 0 });
  }

   const ownerPending = await prisma.visitRequest.count({
    where: {
      status: "PENDING",
      listing: { ownerId: session.user.id },
    },
  });