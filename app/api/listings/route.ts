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