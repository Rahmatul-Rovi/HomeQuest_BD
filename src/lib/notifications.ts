import { prisma } from "@/lib/prisma";

export type NotificationKind =
  | "VISIT_REQUEST"
  | "VISIT_CONFIRMED"
  | "VISIT_REJECTED"
  | "VISIT_CANCELLED"
  | "OWNER_VERIFIED"
  | "OWNER_UNVERIFIED"
  | "LISTING_REMOVED";

type CreateNotificationParams = {
  userId: string;
  type: NotificationKind;
  title: string;
  body: string;
  link?: string;
};

export async function createNotification({
  userId,
  type,
  title,
  body,
  link,
}: CreateNotificationParams) {
  try {
    await prisma.notification.create({
      data: { userId, type, title, body, link: link ?? null },
    });
  } catch (error) {
    console.error("createNotification failed:", error);
  }
}