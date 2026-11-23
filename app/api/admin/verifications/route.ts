import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";


export const dynamic = "force-dynamic";

export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const requests = await prisma.verificationRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          role: true,
          verified: true,
        },
      },
    },
  });

  return NextResponse.json(requests);
}