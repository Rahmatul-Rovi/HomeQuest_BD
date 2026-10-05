import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { name: true, verified: true } } },
    });
    return NextResponse.json(listings);
  } catch (error) {
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
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}