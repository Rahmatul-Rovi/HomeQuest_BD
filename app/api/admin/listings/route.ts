import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";


export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { name: true, verified: true } } },
  });

  return NextResponse.json(listings);
}