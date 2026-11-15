import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ListingFilters from "@/components/ListingFilters";
import ListingGrid from "@/components/ListingGrid";

type SearchParams = { [key: string]: string | string[] | undefined };