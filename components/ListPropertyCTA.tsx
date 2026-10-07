import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, TrendingUp, Clock, ShieldCheck, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Reach More Tenants",
    desc: "Your property gets seen by thousands of active renters every month",
  },
  {
    icon: Clock,
    title: "List in Minutes",
    desc: "Add photos, set your price, and go live — no paperwork, no waiting",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Trusted",
    desc: "Get a verified badge that builds instant trust with tenants",
  },
];

export default function ListPropertyCTA() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl shadow-emerald-950/20">
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-24 -right-16 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Text + CTA */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-emerald-300 uppercase bg-emerald-800/60 border border-emerald-700/60 rounded-full">
                <Home size={14} /> For Property Owners
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                Have a Property to Rent or Sell?
              </h2>

              <p className="text-emerald-100/80 text-sm md:text-base mb-8 max-w-md leading-relaxed">
                Join hundreds of verified owners on HomeQuest BD and connect
                with genuine tenants and buyers — completely free to list.
              </p>

              <Link href="/listings/new">
                <Button className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold px-6 py-6 text-base flex items-center gap-2 w-fit">
                  List Your Property
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>

            {/* Right: Benefits List */}
            <div className="space-y-5">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={benefit.title}
                    className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-emerald-100/70 text-xs leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}