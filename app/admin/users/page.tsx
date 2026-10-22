"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  _count: { listings: number };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleVerify = async (userId: string, current: boolean) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified: !current }),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, verified: !current } : u))
      );
       Swal.fire({
        icon: "success",
        title: !current ? "Owner Verified" : "Verification Removed",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  };

  if (loading) {
    return <div className="p-6 md:p-10 animate-pulse h-64 bg-gray-100 rounded-2xl m-6" />;
  }