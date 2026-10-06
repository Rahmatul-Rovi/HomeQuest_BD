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

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-primary shrink-0" />
              Dhaka, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-primary shrink-0" />
              +880 1XXX-XXXXXX
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-primary shrink-0" />
              support@homequestbd.com
            </li>
            <li className="flex items-center gap-2 pt-2">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary transition"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} HomeQuest BD. All rights reserved.
      </div>
    </footer>
  );
}