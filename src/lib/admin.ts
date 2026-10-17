import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return { authorized: false, userId: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  return { authorized: user?.role === "ADMIN", userId: session.user.id };
}