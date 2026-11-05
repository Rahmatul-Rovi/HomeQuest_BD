import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = ["CONFIRMED", "REJECTED", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const visitRequest = await prisma.visitRequest.findUnique({
      where: { id },
      include: {
        listing: { select: { id: true, title: true, ownerId: true } },
      },
    });

    if (!visitRequest) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isOwner = visitRequest.listing.ownerId === session.user.id;
    const isTenant = visitRequest.tenantId === session.user.id;

    if (!isOwner && !isTenant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }


    const allowedStatuses = isOwner
      ? ["CONFIRMED", "REJECTED", "COMPLETED"]
      : ["CANCELLED"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "You are not allowed to set this status" },
        { status: 403 }
      );
    }

    const updated = await prisma.visitRequest.update({
      where: { id },
      data: { status },
    });

    const dateLabel = visitRequest.visitDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
    const when = `${dateLabel} at ${visitRequest.visitTime}`;
    const listingTitle = visitRequest.listing.title;