import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST - New visit request create
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, visitDate, visitTime, message } = body;

    if (!listingId || !visitDate || !visitTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    return NextResponse.json(visitRequest, { status: 201 });
  } catch (error) {
    console.error("POST /api/visits error:", error);
    return NextResponse.json(
      { error: "Failed to create visit request" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role"); // "tenant" or "owner"

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