"use client";

import { useEffect, useState } from "react";

type VisitRequest = {
  id: string;
  visitDate: string;
  visitTime: string;
  status: string;
  listing: { title: string };
};

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/visits")
      .then((res) => res.json())
      .then((data) => {
        setVisits(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);