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

   if (loading) {
    return <div className="p-6 md:p-10 animate-pulse h-64 bg-gray-100 rounded-2xl m-6" />;
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Visit Requests</h1>
      <p className="text-gray-500 text-sm mb-8">All scheduled visits across the platform.</p>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Listing</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Time</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>