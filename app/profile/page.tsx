"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlistStore";
import {
  Camera,
  BadgeCheck,
  Mail,
  Phone,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Home,
  CalendarCheck,
  Heart,
  LayoutDashboard,
  MessageCircleMore,
  Bell,
  ShieldCheck,
  Trash2,
} from "lucide-react";

type Role = "TENANT" | "OWNER" | "ADMIN";

type Profile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  bio: string | null;
  role: Role;
  verified: boolean;
  createdAt: string;
  hasPassword: boolean;
  stats: { listings: number; visitRequests: number };
};

const ROLE_STYLES: Record<Role, { label: string; className: string }> = {
  TENANT: { label: "Tenant", className: "bg-sky-100 text-sky-700" },
  OWNER: { label: "Owner", className: "bg-emerald-100 text-emerald-700" },
  ADMIN: { label: "Admin", className: "bg-amber-100 text-amber-700" },
};

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}
      </label>
      <div className="flex items-center border border-gray-200 rounded-lg px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition">
        <Lock size={16} className="text-gray-400 mr-2 shrink-0" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full py-2.5 text-sm outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="text-gray-400 hover:text-gray-600 shrink-0"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>

         </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { status, update } = useSession();
  const wishlistCount = useWishlistStore((s) => s.wishlist.length);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "security">("profile");

  // Profile form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/profile");
    }
  }, [status, router]);

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed");
      const data: Profile = await res.json();
      setProfile(data);
      setName(data.name);
      setPhone(data.phone ?? "");
      setBio(data.bio ?? "");
      setImage(data.image);
    }

    catch {
      Swal.fire({
        icon: "error",
        title: "Could not load profile",
        confirmButtonColor: "#16A34A",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") loadProfile();
  }, [status, loadProfile]);

  const isDirty =
    profile !== null &&
    (name !== profile.name ||
      phone !== (profile.phone ?? "") ||
      bio !== (profile.bio ?? "") ||
      image !== profile.image);

       const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "warning",
        title: "Please choose an image file",
        confirmButtonColor: "#16A34A",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "Image is too large",
        text: "Please choose a photo under 5 MB.",
        confirmButtonColor: "#16A34A",
      });
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");

      setImage(data.secure_url);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: "Could not upload your photo. Please try again.",
        confirmButtonColor: "#16A34A",
      });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDiscard = () => {
    if (!profile) return;
    setName(profile.name);
    setPhone(profile.phone ?? "");
    setBio(profile.bio ?? "");
    setImage(profile.image);
  };

   const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !isDirty || saving) return;

    setSaving(true);
    try {
      const body: Record<string, unknown> = { name, phone, bio };
      if (image !== profile.image) body.image = image;

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Could not save",
          text: data.error || "Something went wrong.",
          confirmButtonColor: "#16A34A",
        });
        return;
      }

      setProfile({
        ...profile,
        name: data.name,
        phone: data.phone,
        bio: data.bio,
        image: data.image,
      });
      setName(data.name);
      setPhone(data.phone ?? "");
      setBio(data.bio ?? "");
      setImage(data.image);

      await update({ name: data.name, image: data.image });

      Swal.fire({
        icon: "success",
        title: "Profile updated",
        timer: 1200,
        showConfirmButton: false,
      });
    }

    catch {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        confirmButtonColor: "#16A34A",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (newPassword.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Password too short",
        text: "Use at least 6 characters.",
        confirmButtonColor: "#16A34A",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Passwords don't match",
        text: "Please re-enter the same new password.",
        confirmButtonColor: "#16A34A",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Could not change password",
          text: data.error || "Something went wrong.",
          confirmButtonColor: "#16A34A",
        });
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setProfile({ ...profile, hasPassword: true });

       Swal.fire({
        icon: "success",
        title: profile.hasPassword ? "Password changed" : "Password set",
        text: "You can now log in with your email and password.",
        confirmButtonColor: "#16A34A",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        confirmButtonColor: "#16A34A",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  // Loading skeleton
  if (status === "loading" || loading || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

         <div className="flex-1">
          <div className="h-32 bg-gray-200 animate-pulse" />
          <div className="max-w-5xl mx-auto px-4 md:px-8 animate-pulse">
            <div className="-mt-14 w-28 h-28 rounded-full bg-gray-300 ring-4 ring-gray-50" />
            <div className="mt-6 grid lg:grid-cols-[320px_1fr] gap-6">
              <div className="h-80 bg-gray-100 rounded-2xl" />
              <div className="h-96 bg-gray-100 rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const roleStyle = ROLE_STYLES[profile.role];
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const avatar = image ? (
    <Image
      src={image}
      alt={name || "Profile photo"}
      width={112}
      height={112}
      className="w-28 h-28 rounded-full object-cover ring-4 ring-white shadow-md bg-white"
    />

    ) : (
    <div className="w-28 h-28 rounded-full ring-4 ring-white shadow-md bg-primary-light flex items-center justify-center text-primary text-4xl font-bold">
      {(name || profile.email).charAt(0).toUpperCase()}
    </div>
  );

  const quickLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Messages", href: "/messages", icon: MessageCircleMore },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    ...(profile.role === "ADMIN"
      ? [{ label: "Admin Panel", href: "/admin", icon: ShieldCheck }]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

<main className="flex-1">
        {/* Banner */}
        <div className="relative h-32 md:h-40 bg-gradient-to-r from-primary to-emerald-400 overflow-hidden">
          <div className="absolute -top-16 -right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 pb-12">
          {/* Avatar + Name */}
          <div className="-mt-14 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative w-fit">
              {avatar}
              <label
                className={`absolute bottom-1 right-1 w-9 h-9 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center shadow cursor-pointer transition ${
                  uploading ? "pointer-events-none opacity-80" : ""
                }`}
                title="Change photo"
              >
                {uploading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Camera size={16} />
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

             <div className="sm:pb-2 min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 truncate">
                {profile.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleStyle.className}`}
                >
                  {roleStyle.label}
                </span>
                {profile.verified ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary-light px-2.5 py-1 rounded-full">
                    <BadgeCheck size={13} /> Verified
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                    Not verified
                  </span>
                )}
              </div>
            </div>
          </div>

           <div className="mt-8 grid lg:grid-cols-[320px_1fr] gap-6 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="mx-auto w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center mb-1.5">
                      <Home size={16} className="text-primary" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {profile.stats.listings}
                    </p>
                    <p className="text-[11px] text-gray-400">Listings</p>
                  </div>
                  <div>
                    <div className="mx-auto w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center mb-1.5">
                      <CalendarCheck size={16} className="text-primary" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {profile.stats.visitRequests}
                    </p>
                    <p className="text-[11px] text-gray-400">Visits</p>
                  </div>
                  <div>
                    <div className="mx-auto w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center mb-1.5">
                      <Heart size={16} className="text-primary" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {wishlistCount}
                    </p>
                    <p className="text-[11px] text-gray-400">Saved</p>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-gray-100 space-y-3 text-sm">
                  <div className="flex items-center gap-2.5 text-gray-600 min-w-0">
                    <Mail size={15} className="text-gray-400 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-600">
                    <Phone size={15} className="text-gray-400 shrink-0" />
                    <span>{profile.phone || "No phone added"}</span>
                  </div>
                  <p className="text-xs text-gray-400">Member since {memberSince}</p>
                </div>

                {profile.bio && (
                  <p className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {profile.bio}
                  </p>
                )}
              </div>