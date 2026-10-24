import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";


export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const visits = await prisma.visitRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { listing: { select: { title: true } } },
  });

  return NextResponse.json(visits);
}