import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const PHONE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [user, listings, visitRequests] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        bio: true,
        role: true,
        verified: true,
        createdAt: true,
        password: true,
      },
    }),

    prisma.listing.count({ where: { ownerId: userId } }),
    prisma.visitRequest.count({ where: { tenantId: userId } }),
  ]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { password, ...safeUser } = user;

  return NextResponse.json({
    ...safeUser,
    hasPassword: Boolean(password),
    stats: { listings, visitRequests },
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const data: {
    name?: string;
    phone?: string | null;
    bio?: string | null;
    image?: string | null;
  } = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (name.length < 2 || name.length > 60) {
      return NextResponse.json(
        { error: "Name must be between 2 and 60 characters" },
        { status: 400 }
      );
    }
    data.name = name;
  }