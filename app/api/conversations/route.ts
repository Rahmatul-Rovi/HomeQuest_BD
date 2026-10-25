import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await req.json();

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.ownerId === session.user.id) {
    return NextResponse.json(
      { error: "You cannot message your own listing" },
      { status: 400 }
    );
  }

   const conversation = await prisma.conversation.upsert({
    where: {
      listingId_tenantId: { listingId, tenantId: session.user.id },
    },
    update: {},
    create: {
      listingId,
      tenantId: session.user.id,
      ownerId: listing.ownerId,
    },
  });

  return NextResponse.json(conversation);
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ tenantId: session.user.id }, { ownerId: session.user.id }],
    },
    include: {
      listing: { select: { title: true, images: true } },
      tenant: { select: { id: true, name: true, image: true } },
      owner: { select: { id: true, name: true, image: true } },
      messages: {