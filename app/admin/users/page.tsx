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

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Users</h1>
      <p className="text-gray-500 text-sm mb-8">
        Manage all registered users and owner verification.
      </p>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Role</th>
              <th className="text-left px-4 py-3">Listings</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{u._count.listings}</td>
                <td className="px-4 py-3">
                  {u.verified ? (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <BadgeCheck size={13} /> Verified
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Not Verified</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    onClick={() => toggleVerify(u.id, u.verified)}
                    className={
                      u.verified
                        ? "text-xs border border-red-200 text-red-500 hover:bg-red-50 bg-white"
                        : "text-xs bg-primary hover:bg-primary-dark text-white"
                    }
                  >
                    {u.verified ? "Unverify" : "Verify"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}