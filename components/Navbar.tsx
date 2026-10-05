"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
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
          <Link href="/wishlist" className="text-gray-600 hover:text-primary">
            <Heart size={20} />
          </Link>

          <Link href="/login">
            <Button variant="ghost" className="text-gray-700">Log In</Button>
          </Link>

          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Sign Up
            </Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-4 pb-4 bg-white border-t border-gray-100">
          <Link href="/listings?type=RENT" className="py-2 text-gray-700">Rent</Link>
          <Link href="/listings?type=SALE" className="py-2 text-gray-700">Buy / Sell</Link>
          <Link href="/listings/new" className="py-2 text-gray-700">List Your Property</Link>
          <Link href="/wishlist" className="py-2 text-gray-700 flex items-center gap-2">
            <Heart size={18} /> Wishlist
          </Link>
          <Link href="/login" className="py-2 text-gray-700">Log In</Link>
          <Link href="/signup">
            <Button className="bg-primary text-white w-full">Sign Up</Button>
          </Link>
        </div>
      )}
    </header>
  );
}