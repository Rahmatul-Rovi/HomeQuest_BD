import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listings = await prisma.listing.findMany({
      where: { ownerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { visitRequests: true } },
      },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("GET /api/listings/my-listings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch your listings" },
      { status: 500 }
    );
  }
}