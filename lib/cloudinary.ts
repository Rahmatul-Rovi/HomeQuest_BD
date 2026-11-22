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

export function signUploadParams(params: Record<string, string | number>) {
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret) throw new Error("CLOUDINARY_API_SECRET is not set");

  const toSign = Object.entries(params)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto.createHash("sha1").update(toSign + secret).digest("hex");
}