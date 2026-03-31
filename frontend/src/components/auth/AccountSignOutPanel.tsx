"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authStyles } from "@/styles/auth";

export default function AccountSignOutPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    setError("");

    try {
      setLoading(true);

      // Optional future backend logout call
      // await fetch("http://localhost:8000/logout", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // Clear frontend auth data
      localStorage.removeItem("token");

      // Redirect back to sign-in
      router.push("/account-signin");
    } catch {
      setError("Could not sign out right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center text-sm sm:text-base text-slate-300">
        Are you sure you want to sign out of your account?
      </div>

      {error && <div className={authStyles.errorBox}>{error}</div>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={loading}
          className={authStyles.button}
        >
          {loading ? "Signing Out..." : "Sign Out"}
        </button>
      </div>

      <div className="space-y-2 text-center text-sm text-slate-400">
        <p>
          Changed your mind?{" "}
          <Link href="/account-signin" className={authStyles.link}>
            Return to Sign In
          </Link>
        </p>

        <p>
          Need a new account?{" "}
          <Link href="/account-creation" className={authStyles.link}>
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}