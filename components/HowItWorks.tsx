import { Search, MessagesSquare, KeyRound, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search & Filter",
    desc: "Browse thousands of verified flats, mess, and sublets across Dhaka using area and price filters",
    badge: "Easy Search",
  },
  {
    number: "02",
    icon: MessagesSquare,
    title: "Chat & Schedule Visit",
    desc: "Message the owner directly, ask questions, and book a visit — no broker needed",
    badge: "No Broker Fee",
  },
  {
    number: "03",
    icon: KeyRound,
    title: "Move In Stress-Free",
    desc: "Confirm the deal with a verified owner and move into your new home with confidence",
    badge: "Verified Owner",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-white to-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-3 text-xs font-semibold tracking-wider text-emerald-700 uppercase bg-emerald-100/80 rounded-full">
            <Sparkles size={14} /> Simple 3-Step Process
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            How <span className="text-emerald-600">HomeQuest BD</span> Works
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-3">
            Finding your next home has never been this simple, safe, and broker-free.
          </p>
        </div>