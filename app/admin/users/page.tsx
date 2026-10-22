"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  _count: { listings: number };
};