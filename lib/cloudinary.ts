import crypto from "crypto";

export const VERIFICATION_FOLDER = "homequest/verification";

export function isVerificationImageUrl(url: unknown): url is string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return (
    typeof url === "string" &&
    Boolean(cloud) &&
    url.startsWith(`https://res.cloudinary.com/${cloud}/`) &&
    url.includes("/authenticated/") &&
    url.includes(`/${VERIFICATION_FOLDER}/`)
  );
}