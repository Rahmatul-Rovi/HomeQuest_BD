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
          <Link href="/wishlist" className="text-gray-600 hover:text-primary text-sm font-medium flex items-center gap-1">
            <Heart size={16} /> Wishlist
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-700">Log In</Button>
          </Link>
          <Link href="/listings/new">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              List Your Property
            </Button>
          </Link>
        </div>