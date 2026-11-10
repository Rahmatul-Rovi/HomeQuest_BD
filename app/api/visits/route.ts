import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "@/src/lib/notifications";


// POST - Notun visit request create kora
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId, visitDate, visitTime, message } = await req.json();

    if (!listingId || !visitDate || !visitTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, ownerId: true, title: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.ownerId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot book a visit for your own listing" },
        { status: 400 }
      );
    }

    const visitRequest = await prisma.visitRequest.create({
      data: {
        listingId,
        tenantId: session.user.id,
        visitDate: new Date(visitDate),
        visitTime,
        message: message || null,
      },
    });

    const dateLabel = new Date(visitDate).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    console.log(
      `[visit] request ${visitRequest.id} by ${session.user.id} -> listing owner ${listing.ownerId}`
    );

    await createNotification({
      userId: listing.ownerId,
      type: "VISIT_REQUEST",
      title: "New visit request",
      body: `${session.user.name ?? "Someone"} wants to visit "${listing.title}" on ${dateLabel} at ${visitTime}.`,
      link: "/dashboard",
    });

    return NextResponse.json(visitRequest, { status: 201 });
  } catch (error) {
    console.error("POST /api/visits error:", error);
    return NextResponse.json(
      { error: "Failed to create visit request" },
      { status: 500 }
    );
  }
}

// GET - Visit request list (tenant or owner)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    if (role === "owner") {
      const requests = await prisma.visitRequest.findMany({
        where: { listing: { ownerId: session.user.id } },
        include: {
          listing: { select: { title: true, address: true, images: true } },
          tenant: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(requests);
    }

    const requests = await prisma.visitRequest.findMany({
      where: { tenantId: session.user.id },
      include: {
        listing: { select: { title: true, address: true, images: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("GET /api/visits error:", error);
    return NextResponse.json(
      { error: "Failed to fetch visit requests" },
      { status: 500 }
    );
  }
}