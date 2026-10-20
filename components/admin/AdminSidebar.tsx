"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Home,
  CalendarCheck,
  ArrowLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Listings", href: "/admin/listings", icon: Home },
  { label: "Visit Requests", href: "/admin/visits", icon: CalendarCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-100 min-h-screen sticky top-0 hidden md:flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">Admin Panel</h2>
        <p className="text-xs text-gray-400 mt-0.5">HomeQuest BD</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-primary-light text-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
        >
          <ArrowLeft size={18} /> Back to Site
        </Link>
      </div>
    </aside>
  );
}