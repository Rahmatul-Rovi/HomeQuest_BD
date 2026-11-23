import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { createNotification } from "@/lib/notifications";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { action, note } = await req.json();

  if (action !== "APPROVE" && action !== "REJECT") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const cleanNote = typeof note === "string" ? note.trim().slice(0, 300) : "";
  if (action === "REJECT" && cleanNote.length < 5) {
    return NextResponse.json(
      { error: "Please give a short reason for rejecting." },
      { status: 400 }
    );
  }

  const request = await prisma.verificationRequest.findUnique({
    where: { id },
    select: { id: true, userId: true, status: true },
  });
  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }