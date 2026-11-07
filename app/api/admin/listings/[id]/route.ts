import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";
import { createNotification } from "@/src/lib/notifications";


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const updated = await prisma.listing.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { title: true, ownerId: true },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  await prisma.listing.delete({ where: { id } });

  await createNotification({
    userId: listing.ownerId,
    type: "LISTING_REMOVED",
    title: "Listing removed",
    body: `Your listing "${listing.title}" was removed by an admin. Contact support if you think this is a mistake.`,
    link: "/dashboard",
  });

  return NextResponse.json({ success: true });
}