"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authStyles } from "@/styles/auth";

export default function AccountSignInForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = (): string => {
    if (!username.trim() || !password.trim()) {
      return "Username and password are required.";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Incorrect username or password.");
        return;
      }

      // Later, when backend auth is ready, store token here if needed
      // localStorage.setItem("token", data.access_token);

      router.push("/planner");
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
          <label htmlFor="password" className={authStyles.label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={authStyles.input}
          />
        </div>

        {error && <div className={authStyles.errorBox}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className={authStyles.button}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="mt-4 space-y-2 text-center text-sm text-slate-400">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/account-creation" className={authStyles.link}>
            Create Account
          </Link>
        </p>

        <p>
          Forgot your password?{" "}
          <Link href="/password-reset" className={authStyles.link}>
            Reset Password
          </Link>
        </p>
      </div>
    </>
  );
}