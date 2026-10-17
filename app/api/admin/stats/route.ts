import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";


export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalUsers, totalListings, pendingVerifications, totalVisits] =
    await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.user.count({ where: { role: "OWNER", verified: false } }),
      prisma.visitRequest.count(),
    ]);

  return NextResponse.json({
    totalUsers,
    totalListings,
    pendingVerifications,
    totalVisits,
  });
}