"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Trash2 } from "lucide-react";

type AdminListing = {
  id: string;
  title: string;
  address: string;
  status: string;
  images: string[];
  owner: { name: string; verified: boolean };
};

export default function AdminListingsPage() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);