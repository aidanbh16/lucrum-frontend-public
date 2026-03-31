"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authStyles } from "@/styles/auth";

export default function PasswordResetForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = (): string => {
    if (
      !username.trim() ||
      !email.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      return "All fields are required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address.";
    }

    if (newPassword.length < 8) {
      return "New password must be at least 8 characters long.";
    }

    if (newPassword !== confirmPassword) {
      return "Passwords do not match.";
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

      const response = await fetch("http://localhost:8000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Could not reset password.");
        return;
      }

      setSuccess("Password reset successfully.");

      setUsername("");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/account-signin");
      }, 1000);
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={authStyles.form}>
        <div>
          <label htmlFor="username" className={authStyles.label}>
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className={authStyles.input}
          />
        </div>

        <div>
          <label htmlFor="email" className={authStyles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className={authStyles.input}
          />
        </div>

        <div>
          <label htmlFor="newPassword" className={authStyles.label}>
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className={authStyles.input}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className={authStyles.label}>
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className={authStyles.input}
          />
        </div>

        {error && <div className={authStyles.errorBox}>{error}</div>}
        {success && <div className={authStyles.successBox}>{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className={authStyles.button}
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>

      <div className="mt-4 space-y-2 text-center text-sm text-slate-400">
        <p>
          Remembered your password?{" "}
          <Link href="/account-signin" className={authStyles.link}>
            Sign in
          </Link>
        </p>

        <p>
          Need to create an account?{" "}
          <Link href="/account-creation" className={authStyles.link}>
            Create Account
          </Link>
        </p>
      </div>
    </>
  );
}