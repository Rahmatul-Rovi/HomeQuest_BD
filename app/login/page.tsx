"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Swal from "sweetalert2";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password.",
        confirmButtonColor: "#16A34A",
      });
      return;
    }

      Swal.fire({
      icon: "success",
      title: "Welcome Back!",
      timer: 1200,
      showConfirmButton: false,
    }).then(() => {
      router.push(redirectTo);
      router.refresh();
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h1 className="text-xl font-bold text-gray-900 text-center mb-1">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Log in to continue to HomeQuest BD
        </p>