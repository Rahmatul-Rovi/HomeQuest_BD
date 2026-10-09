import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingFilters from "@/components/ListingFilters";
import ListingGrid from "@/components/ListingGrid";

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Browse Properties
        </h1>