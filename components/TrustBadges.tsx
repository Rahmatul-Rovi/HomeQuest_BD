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