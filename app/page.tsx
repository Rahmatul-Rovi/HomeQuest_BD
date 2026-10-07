import Categories from "@/components/Categories";
import FeaturedListings from "@/components/FeaturedListings";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import TrustBadges from "@/components/TrustBadges";
import Image from "next/image";

export default function Home() {
  return (
   <main className="min-h-screen bg-white">
       <Navbar/>
       <Hero/>
       <Categories/>
       <FeaturedListings/>
       <TrustBadges/>
       <Testimonials/>
       <Footer/>
   </main>
  );
}
