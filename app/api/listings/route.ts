import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/src/generated/prisma";


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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const listing = await prisma.listing.create({
      data: {
        title: body.title,
        description: body.description,
        listingType: body.listingType,
        category: body.category,
        price: body.price,
        bedroom: body.bedroom,
        bathroom: body.bathroom,
        areaSize: body.areaSize,
        bachelorAllowed: body.bachelorAllowed,
        address: body.address,
        lat: body.lat,
        lng: body.lng,
        images: body.images || [],
        ownerId: body.ownerId,
      },
    });
    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}