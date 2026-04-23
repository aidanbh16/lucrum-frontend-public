"use client";

import { useState } from "react";
import AllocationManagement from "@/components/allocation/finalAllocation";
import MyIncome from "@/components/income/myIncome";
import { incomeStyles } from "@/styles/income";
import Image from "next/image";


export default function Home() {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);

  const handleSignOut = () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    window.location.href = "/account-signin";
  };



  return (
    <main className={incomeStyles.pageWrapper}>
      <div className="mx-auto w-full max-w-5xl">

        <div className="mb-0 flex justify-center">
          <Image
            src="/logo/LucrumLogo.png"
            alt="Lucrum Logo"
            width={300}
            height={200}
            priority
          />
        </div>

          <h1 className={`${incomeStyles.title} text-center`}>Welcome to Lucrum</h1>
          <p className={`${incomeStyles.subtitle} mt-2 text-center`}>
            Manage your monthly income and allocations in one place.
          </p>

        <section className="mb-8">
          <MyIncome setTotalIncome={setTotalIncome} />
        </section>

        <section className="mb-8">
          <AllocationManagement totalIncome={totalIncome} />
        </section>

      </div>

      <div className="flex justify-center">
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className={`${incomeStyles.button} !w-auto px-6 ${
          isSigningOut ? "cursor-not-allowed opacity-60" : "" }`}
        >
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </button>
      </div>

    </main>

  );
}