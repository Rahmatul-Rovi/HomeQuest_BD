import {
  ShieldCheck,
  MapPinned,
  MessageCircleMore,
  Headphones,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: "Verified Property Owners",
    desc: "Every owner's NID is manually checked before their listing goes live on the platform.",
    badge: "ID Verified",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    highlights: ["NID Checked", "Admin Approved"],
  },
  {
    icon: MapPinned,
    title: "Map-Based Search",
    desc: "See exactly where a property is located before you ever leave your house.",
    badge: "Live Map",
    gradient: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/20",
    highlights: ["Accurate Location", "Nearby Landmarks"],
  },
  {
    icon: MessageCircleMore,
    title: "Direct Owner Chat",
    desc: "Message property owners directly in real time — no middleman, no broker fees.",
    badge: "Real-Time",
    gradient: "from-teal-500 to-cyan-600",
    shadow: "shadow-teal-500/20",
    highlights: ["Instant Messaging", "No Broker Fee"],
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Our support team is ready to help with disputes, fraud reports, or any issue.",
    badge: "Always Active",
    gradient: "from-emerald-600 to-emerald-800",
    shadow: "shadow-emerald-600/20",
    highlights: ["Fraud Reporting", "Quick Response"],
  },
];

const stats = [
  { value: "500+", label: "Active Listings" },
  { value: "100%", label: "Owner Verified" },
  { value: "1,200+", label: "Happy Tenants" },
  { value: "24/7", label: "Support Available" },
];

export default function TrustBadges() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 my-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Background Wrapper with Ambient Glow */}
        <div className="bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 rounded-3xl p-6 sm:p-10 md:p-12 border border-emerald-100/90 shadow-2xl shadow-emerald-950/5 relative overflow-hidden">
          {/* Ambient Background Glow Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Title Section */}
          <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-3 text-xs font-semibold tracking-wider text-emerald-700 uppercase bg-emerald-100/80 rounded-full">
              <Sparkles size={14} /> Why Choose HomeQuest BD
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Renting Made <span className="text-emerald-600">Simple & Safe</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-2">
              We prioritize trust, transparency, and speed in every property search and booking.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 mb-12">
            {trustFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-white rounded-2xl p-6 border border-gray-100/90 shadow-sm hover:shadow-xl hover:border-emerald-300 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Icon & Top Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center shrink-0 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon size={26} />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                        {feature.badge}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4">
                      {feature.desc}
                    </p>
                  </div>

                  {/* Feature Checklist Tags */}
                  <div className="pt-4 border-t border-gray-100/80 space-y-1.5">
                    {feature.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Bar */}
          <div className="relative z-10 bg-emerald-900 text-white rounded-2xl p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-lg">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-400 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-emerald-100/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}