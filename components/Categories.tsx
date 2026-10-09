import Link from "next/link";
import { Building2, Users, BedSingle, Home, KeyRound, type LucideIcon } from "lucide-react";

interface CategoryItem {
  label: string;
  icon: LucideIcon;
  type: "RENT" | "SALE";
  category: string;
  // Specific colorful styling for each category
  bgColor: string;
  borderColor: string;
  iconColor: string;
  badgeBg: string;
}

const CATEGORIES: readonly CategoryItem[] = [
  {
    label: "Full Flat",
    icon: Building2,
    type: "RENT",
    category: "FULL_FLAT",
    bgColor: "from-amber-500/10 via-amber-500/5 to-transparent",
    borderColor: "border-amber-200 group-hover:border-amber-500",
    iconColor: "text-amber-600 group-hover:text-amber-700",
    badgeBg: "bg-amber-100 group-hover:bg-amber-200/80",
  },
  {
    label: "Mess",
    icon: Users,
    type: "RENT",
    category: "MESS",
    bgColor: "from-blue-500/10 via-blue-500/5 to-transparent",
    borderColor: "border-blue-200 group-hover:border-blue-500",
    iconColor: "text-blue-600 group-hover:text-blue-700",
    badgeBg: "bg-blue-100 group-hover:bg-blue-200/80",
  },
  {
    label: "Seat",
    icon: BedSingle,
    type: "RENT",
    category: "SEAT",
    bgColor: "from-teal-500/10 via-teal-500/5 to-transparent",
    borderColor: "border-teal-200 group-hover:border-teal-500",
    iconColor: "text-teal-600 group-hover:text-teal-700",
    badgeBg: "bg-teal-100 group-hover:bg-teal-200/80",
  },
  {
    label: "Sublet",
    icon: KeyRound,
    type: "RENT",
    category: "SUBLET",
    bgColor: "from-orange-500/10 via-orange-500/5 to-transparent",
    borderColor: "border-orange-200 group-hover:border-orange-500",
    iconColor: "text-orange-600 group-hover:text-orange-700",
    badgeBg: "bg-orange-100 group-hover:bg-orange-200/80",
  },
  {
    label: "Flat for Sale",
    icon: Home,
    type: "SALE",
    category: "FLAT_SALE",
    bgColor: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    borderColor: "border-emerald-200 group-hover:border-emerald-500",
    iconColor: "text-emerald-600 group-hover:text-emerald-700",
    badgeBg: "bg-emerald-100 group-hover:bg-emerald-200/80",
  },
] as const;

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Browse by Category
        </h2>
        <p className="text-slate-500 text-sm sm:text-base">
          Whatever you&apos;re looking for, we&apos;ve got it covered.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {CATEGORIES.map(
          ({
            label,
            icon: Icon,
            type,
            category,
            bgColor,
            borderColor,
            iconColor,
            badgeBg,
          }) => (
            <Link
              key={category}
              href={`/listings?type=${type}&category=${category}`}
              className={`group relative flex flex-col items-center justify-center p-6 bg-white border ${borderColor} rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95`}
            >
              {/* Vibrant Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              {/* Colorful Icon Badge */}
              <div
                className={`relative mb-4 p-4 rounded-full ${badgeBg} transition-all duration-300 group-hover:scale-110 shadow-sm`}
              >
                <Icon size={28} className={`${iconColor} transition-colors duration-300`} />
              </div>

              {/* Label */}
              <span className="relative text-sm sm:text-base font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300 text-center">
                {label}
              </span>
            </Link>
          )
        )}
      </div>
    </section>
  );
}