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