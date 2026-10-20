"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ShieldAlert } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/admin");
    }
    if (status === "authenticated") {
      setChecked(true);
    }
  }, [status, router]);

  const role = (session?.user as { role?: string })?.role;

  if (status === "loading" || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <ShieldAlert size={40} className="text-red-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-500 text-sm mt-1">
            You don&apos;t have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}