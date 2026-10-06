import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const area = searchParams.get("area");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bachelorOnly = searchParams.get("bachelorAllowed");

    const where: Prisma.ListingWhereInput = {
      status: "ACTIVE",
    };

    if (type === "RENT" || type === "SALE") {
      where.listingType = type;
    }

    if (category) {
      where.category = category as Prisma.EnumCategoryFilter["equals"];
    }

    if (area) {
      where.address = { contains: area, mode: "insensitive" };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (bachelorOnly === "true") {
      where.bachelorAllowed = true;
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { name: true, verified: true } } },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}