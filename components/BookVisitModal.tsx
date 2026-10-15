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