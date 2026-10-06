import Link from "next/link";
import Logo from "@/components/Logo";
import { Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Logo className="[&_span]:text-white" />
          <p className="text-sm text-gray-400 mt-4 leading-relaxed">
            Bangladesh&apos;s trusted platform for renting and buying verified
            properties — no brokers, no hassle.
          </p>
        </div>
          {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/listings?type=RENT" className="hover:text-primary transition">For Rent</Link></li>
            <li><Link href="/listings?type=SALE" className="hover:text-primary transition">For Sale</Link></li>
            <li><Link href="/listings/new" className="hover:text-primary transition">List Your Property</Link></li>
            <li><Link href="/wishlist" className="hover:text-primary transition">Wishlist</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-primary transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition">Privacy Policy</Link></li>
          </ul>
        </div>
