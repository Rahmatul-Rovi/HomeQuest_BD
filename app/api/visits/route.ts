import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST - Notun visit request create kora
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, visitDate, visitTime, message } = body;

    if (!listingId || !visitDate || !visitTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }