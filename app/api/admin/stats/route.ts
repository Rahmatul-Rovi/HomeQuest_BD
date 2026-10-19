import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";


export async function GET() {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalUsers,
    totalListings,
    pendingVerifications,
    totalVisits,
    rentCount,
    saleCount,
    categoryGroups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.user.count({ where: { role: "OWNER", verified: false } }),
    prisma.visitRequest.count(),
    prisma.listing.count({ where: { listingType: "RENT" } }),
    prisma.listing.count({ where: { listingType: "SALE" } }),
    prisma.listing.groupBy({
      by: ["category"],
      _count: { category: true },
    }),
  ]);

  const categoryBreakdown = categoryGroups.map((g) => ({
    name: g.category,
    value: g._count.category,
  }));

  return NextResponse.json({
    totalUsers,
    totalListings,
    pendingVerifications,
    totalVisits,
    typeBreakdown: [
      { name: "Rent", value: rentCount },
      { name: "Sale", value: saleCount },
    ],
    categoryBreakdown,
  });
}