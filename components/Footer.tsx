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