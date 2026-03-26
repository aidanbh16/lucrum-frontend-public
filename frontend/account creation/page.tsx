"use client";

import Image from "next/image";
import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = (): string => {
    if (!username.trim() || !password.trim()) {
      return "Username and password are required.";
    }

    if (username.trim().length < 4) {
      return "Username must be at least 4 characters long.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // Temporary fake delay (replace later with backend)
      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccess("Account successfully created!");
      setUsername("");
      setPassword("");
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-md px-4">
        
        {/* LOGO ABOVE */}
        <Image
          src="/LucrumLogo.png"
          alt="Lucrum Logo"
          width={600}
          height={600}
          className="mb-8"
        />

        {/* CARD */}
        <div className="w-full rounded-2xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
          
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-semibold text-white">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Start managing your finances with clarity
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username */}
            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-sm text-emerald-400">
                {success}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 py-2 font-medium text-white transition hover:bg-emerald-500 disabled:bg-slate-600"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Simple. Clean. Built for better budgeting.
          </p>
        </div>
      </div>
    </div>
  );
}