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