import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/src/generated/prisma";
import { auth } from "@/lib/auth";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const ids = searchParams.get("ids");
    if (ids) {
      const idArray = ids.split(",").filter(Boolean);
      const listings = await prisma.listing.findMany({
        where: { id: { in: idArray } },
        include: { owner: { select: { name: true, verified: true } } },
      });
      return NextResponse.json(listings);
    }
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
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const lat =
      typeof body.lat === "number" && Number.isFinite(body.lat) && Math.abs(body.lat) <= 90
        ? body.lat
        : null;
    const lng =
      typeof body.lng === "number" && Number.isFinite(body.lng) && Math.abs(body.lng) <= 180
        ? body.lng
        : null;

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
        lat,
        lng,
        images: body.images || [],
        ownerId: session.user.id,
      },
    });

    // Prothom listing banale TENANT theke OWNER role e promote
    await prisma.user.updateMany({
      where: { id: session.user.id, role: "TENANT" },
      data: { role: "OWNER" },
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