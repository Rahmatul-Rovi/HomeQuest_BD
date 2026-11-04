import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET - Personal notification list + unread count
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.notification.count({
      where: { userId: session.user.id, read: false },
    }),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}

// PATCH -All notification "read" mark 
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, all } = await req.json();

  if (all) {
    await prisma.notification.updateMany({
      where: { userId: session.user.id, read: false },
      data: { read: true },
    });
  } else if (id) {
    await prisma.notification.updateMany({
      where: { id, userId: session.user.id },
      data: { read: true },
    });
  } else {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

// DELETE - Delete All notification 
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.notification.deleteMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ success: true });
}