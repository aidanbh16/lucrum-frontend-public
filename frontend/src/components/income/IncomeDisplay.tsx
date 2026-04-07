"use client";
import { incomeStyles } from "@/styles/income";

interface IncomeDisplayProps {
  onSwitchToUpdate?: () => void;
}

export default function IncomeDisplay({ onSwitchToUpdate }: IncomeDisplayProps) {
  const incomeStreams = [
    { id: 1, amount: 3200, source: "Primary Job" },
    { id: 2, amount: 450, source: "Freelance Design" },
  ];

  const total = incomeStreams.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className={`${incomeStyles.card} mx-auto w-full max-w-md`}>
      <h2 className={`${incomeStyles.title} text-center`}>Monthly Income Summary</h2>
      
      <div className="space-y-4">
        {incomeStreams.map((stream) => (
          <div key={stream.id} className="flex justify-between items-center p-4 bg-slate-700/50 rounded-xl border border-slate-600">
            <span className="text-slate-300 font-medium">{stream.source}</span>
            <span className="text-emerald-400 font-bold">${stream.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-700 flex justify-between items-center">
        <span className="text-lg text-white font-semibold">Total Monthly:</span>
        <span className="text-2xl text-emerald-400 font-black">${total.toLocaleString()}</span>
      </div>

      <div className="mt-6 text-center border-t border-slate-700/50 pt-4">
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            if (onSwitchToUpdate) onSwitchToUpdate();
          }}
          className="mt-6 text-slate-500 text-sm hover:text-white transition-colors"
        >
          Update Income
        </button>
      </div>
    </div>
  );
}