"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { X, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  listingId: string;
  onClose: () => void;
};

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

export default function BookVisitModal({ listingId, onClose }: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!date || !time) {
      Swal.fire({
        icon: "warning",
        title: "Select Date & Time",
        text: "Please choose a date and time slot for the visit.",
        confirmButtonColor: "#16A34A",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          visitDate: date,
          visitTime: time,
          message,
        }),
      });

        if (!res.ok) throw new Error("Failed");

      onClose();
      Swal.fire({
        icon: "success",
        title: "Visit Requested!",
        text: "The owner will review your request soon. You can track it from your dashboard.",
        confirmButtonColor: "#16A34A",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text: "Could not send visit request. Please try again.",
        confirmButtonColor: "#16A34A",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-bold text-gray-900 mb-1">Book a Visit</h2>
        <p className="text-gray-500 text-sm mb-6">
          Choose your preferred date and time to visit this property.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Calendar size={15} /> Visit Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>