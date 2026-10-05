"use client";

import { useEffect, useState } from "react";
import ListingCard from "@/components/ListingCard";
import Swal from "sweetalert2";

export default function FeaturedListings() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Could not load listings. Please try again.",
          confirmButtonColor: "#16A34A",
        });
      });
  }, []);