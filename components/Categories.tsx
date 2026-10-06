import Link from "next/link";
import { Building2, Users, BedSingle, Home, KeyRound } from "lucide-react";

type CategoryItem = {
  label: string;
  icon: React.ElementType;
  type: "RENT" | "SALE";
  category: string;
};

const categories: CategoryItem[] = [
  { label: "Full Flat", icon: Building2, type: "RENT", category: "FULL_FLAT" },
  { label: "Mess", icon: Users, type: "RENT", category: "MESS" },
  { label: "Seat", icon: BedSingle, type: "RENT", category: "SEAT" },
  { label: "Sublet", icon: KeyRound, type: "RENT", category: "SUBLET" },
  { label: "Flat for Sale", icon: Home, type: "SALE", category: "FLAT_SALE" },
];

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Browse by Category
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Whatever you&apos;re looking for, we&apos;ve got it covered.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map(({ label, icon: Icon, type, category }) => (
          <Link
            key={category}
            href={`/listings?type=${type}&category=${category}`}
            className="group flex flex-col items-center gap-3 bg-white border border-gray-100 rounded-2xl p-6 hover:border-primary hover:shadow-md transition"
          >
            <div className="bg-primary-light p-3.5 rounded-xl group-hover:bg-primary transition">
              <Icon size={24} className="text-primary group-hover:text-white transition" />
            </div>
            <span className="text-sm font-semibold text-gray-700">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}