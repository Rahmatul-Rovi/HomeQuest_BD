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

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 relative">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="group relative bg-white rounded-3xl p-8 border border-emerald-100/80 shadow-lg shadow-emerald-950/5 hover:shadow-xl hover:shadow-emerald-600/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center"
              >
                {/* Step Number Badge */}
                <span className="absolute top-4 right-5 text-3xl font-extrabold text-emerald-100 group-hover:text-emerald-200 transition-colors select-none">
                  {step.number}
                </span>

                {/* Icon Wrapper */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-md shadow-emerald-600/10">
                    <Icon size={28} />
                  </div>
                  <span className="absolute -bottom-2 -right-2 text-[10px] font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                    {step.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-bold text-gray-900 text-xl mb-2.5 group-hover:text-emerald-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                  {step.desc}
                </p>

                {/* Desktop Connector Arrow (Between Step 1->2 and 2->3) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 text-emerald-300 animate-pulse">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}