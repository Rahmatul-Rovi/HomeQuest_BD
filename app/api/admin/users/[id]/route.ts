import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/src/lib/admin";
import { createNotification } from "@/src/lib/notifications";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(body.verified !== undefined && { verified: body.verified }),
      ...(body.role && { role: body.role }),
    },
  });

  if (body.verified !== undefined) {
    await createNotification({
      userId: id,
      type: body.verified ? "OWNER_VERIFIED" : "OWNER_UNVERIFIED",
      title: body.verified ? "You are now verified" : "Verification removed",
      body: body.verified
        ? "Congratulations! Your account now has the Verified Owner badge, which builds trust with tenants."
        : "Your Verified Owner badge was removed by an admin. Contact support if you think this is a mistake.",
      link: "/dashboard",
    });
  }

  return NextResponse.json(updated);
}