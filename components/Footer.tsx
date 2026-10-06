import Link from "next/link";
import Logo from "@/components/Logo";
import { Mail, Phone, MapPin } from "lucide-react";

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
              +880 1533-636073
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-primary shrink-0" />
              support@homequestbd.com
            </li>
           <li className="flex items-center gap-3 pt-2">
  {/* Facebook */}
  <a
    href="#"
    className="bg-gray-800 p-2 rounded-full hover:bg-primary transition"
    aria-label="Facebook"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 12.06C22 6.53 17.52 2 12 2S2 6.53 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.81 8.44-4.94 8.44-9.94z" />
    </svg>
  </a>

  {/* Instagram */}
  <a
    href="#"
    className="bg-gray-800 p-2 rounded-full hover:bg-primary transition"
    aria-label="Instagram"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.248.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.217 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.248-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.217-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.25a3.25 3.25 0 1 1 0-6.5 3.25 3.25 0 0 1 0 6.5zm5.2-8.9a1.17 1.17 0 1 0 0-2.34 1.17 1.17 0 0 0 0 2.34z" />
    </svg>
  </a>

  {/* Twitter / X */}
  <a
    href="#"
    className="bg-gray-800 p-2 rounded-full hover:bg-primary transition"
    aria-label="Twitter"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
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