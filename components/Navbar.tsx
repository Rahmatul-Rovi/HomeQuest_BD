"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Menu,
  Bell,
  MessageCircleMore,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

const CATEGORY_LINKS = [
  { label: "Full Flat", type: "RENT", category: "FULL_FLAT" },
  { label: "Mess", type: "RENT", category: "MESS" },
  { label: "Seat", type: "RENT", category: "SEAT" },
  { label: "Sublet", type: "RENT", category: "SUBLET" },
  { label: "Flat for Sale", type: "SALE", category: "FLAT_SALE" },
  { label: "Land for Sale", type: "SALE", category: "LAND_SALE" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [unreadMessages, setUnreadMessages] = useState(0);
const [unreadNotifications, setUnreadNotifications] = useState(0);

  const isLoggedIn = status === "authenticated";
  const user = session?.user;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  if (!isLoggedIn) return;

  const loadCounts = async () => {
    try {
      const [msgRes, notifRes] = await Promise.all([
        fetch("/api/messages/unread-count"),
        fetch("/api/notifications/count"),
      ]);

      const msgData = await msgRes.json();
      const notifData = await notifRes.json();
      setUnreadMessages(msgData.count);
      setUnreadNotifications(notifData.count);
    } catch {
      
    }
  };

  loadCounts();
  const interval = setInterval(loadCounts, 15000);
  return () => clearInterval(interval);
}, [isLoggedIn]);



  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      {/* Top Row */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/listings?type=RENT" className="text-gray-600 hover:text-primary text-sm font-medium">
            Rent
          </Link>
          <Link href="/listings?type=SALE" className="text-gray-600 hover:text-primary text-sm font-medium">
            Buy / Sell
          </Link>
          <Link href="/listings/new" className="text-gray-600 hover:text-primary text-sm font-medium">
            List Your Property
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/wishlist" className="text-gray-600 hover:text-primary transition">
            <Heart size={20} />
          </Link>

          {isLoggedIn ? (
            <>
              {/* Notification Icon */}
             <button className="relative text-gray-600 hover:text-primary transition">
  <Bell size={20} />
  {unreadNotifications > 0 && (
    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
  )}
</button>

              {/* Message Icon */}
             <Link href="/messages" className="relative text-gray-600 hover:text-primary transition">
  <MessageCircleMore size={20} />
  {unreadMessages > 0 && (
    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
  )}
</Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-50 transition border border-gray-100"
                >
                  {user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary transition"
                    >
                      <User size={16} /> My Profile
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full transition"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu />
        </button>
      </div>

      {/* Category Bar (Desktop) */}
      <div className="hidden md:block border-t border-gray-50 bg-gray-10/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-11 flex items-center gap-7 overflow-x-auto">
          {CATEGORY_LINKS.map((cat) => (
            <Link
              key={cat.category}
              href={`/listings?type=${cat.type}&category=${cat.category}`}
              className="text-sm font-bold text-gray-600 hover:text-primary whitespace-nowrap transition"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-4 pb-4 bg-white border-t border-gray-100">
          <Link href="/listings?type=RENT" className="py-2 text-gray-700">Rent</Link>
          <Link href="/listings?type=SALE" className="py-2 text-gray-700">Buy / Sell</Link>
          <Link href="/listings/new" className="py-2 text-gray-700">List Your Property</Link>
          <Link href="/wishlist" className="py-2 text-gray-700 flex items-center gap-2">
            <Heart size={18} /> Wishlist
          </Link>

          <div className="border-t border-gray-100 my-2 pt-2">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-1.5">
              Categories
            </p>
            {CATEGORY_LINKS.map((cat) => (
              <Link
                key={cat.category}
                href={`/listings?type=${cat.type}&category=${cat.category}`}
                className="block py-1.5 text-sm text-gray-600"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-2 pt-3">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="py-2 text-gray-700 flex items-center gap-2">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link href="/messages" className="py-2 text-gray-700 flex items-center gap-2">
                  <MessageCircleMore size={18} /> Messages
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="py-2 text-red-500 flex items-center gap-2 w-full"
                >
                  <LogOut size={18} /> Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="py-2 text-gray-700 block">Log In</Link>
                <Link href="/signup">
                  <Button className="bg-primary text-white w-full mt-2">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}