"use client";

import { useState } from "react";
import IncomeForm from "@/components/income/IncomeForm";
import IncomeDisplay from "@/components/income/IncomeDisplay";
import IncomeUpdateForm from "@/components/income/IncomeUpdateForm";
import { incomeStyles } from "@/styles/income";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [viewState, setViewState] = useState<"input" | "view" | "update">("input");

  if (!isLoggedIn) {
    return (
      <main className={`${incomeStyles.pageWrapper} flex flex-col items-center justify-center min-h-screen w-full text-center p-6`}>
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Lucrum</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Please log in to your account to manage your budget and view your income.
        </p>
        <div className="flex flex-col items-center gap-4">
          <a 
            href="/account-creation" 
            className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition-colors"
          >
            Go to Account Creation
          </a>
          <button 
            type="button"
            onClick={() => setIsLoggedIn(true)}
            className="mt-12 text-slate-600 text-xs hover:text-slate-400 transition-colors"
          >
            (Bypass Login)
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={`${incomeStyles.pageWrapper} flex flex-col items-center min-h-screen w-full`}>
      <div style={{ width: "100%", padding: "20px 0 20px 0", textAlign: "center" }}>
        <h1 className="text-4xl font-bold text-white mb-2">Lucrum</h1>
        <p className="text-slate-400 mb-10">Your personal budget manager.</p>
      </div>

      <div className="flex flex-col items-center w-full max-w-2xl px-6">
        
        {viewState === "input" && (
          <div className="w-full flex flex-col items-center">
            <IncomeForm onSuccess={() => setViewState("view")} />
          </div>
        )}

        {viewState === "view" && (
          <div className="w-full flex flex-col items-center text-center">
            <IncomeDisplay onSwitchToUpdate={() => setViewState("update")}/>
          </div>
        )}

        {viewState === "update" && (
          <div className="w-full flex flex-col items-center text-center">
            <IncomeUpdateForm onBack={() => setViewState("view")} />
          </div>
        )}

      </div>

      <div style={{ width: "100%", padding: "80px 0", textAlign: "center" }}>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="text-slate-500 hover:text-white text-sm transition-colors"
        >
          Sign Out
        </button>
      </div>

    </main>
  );
}