"use client";
import { useState, useEffect } from "react";
import { incomeStyles } from "@/styles/income";

interface IncomeStream {
  id: number;
  amount: string;
  source: string;
}

interface IncomeUpdateProps {
  onBack?: () => void;
}

export default function IncomeUpdateForm({ onBack }: IncomeUpdateProps) {
  const [streams, setStreams] = useState<IncomeStream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExistingIncome = async () => {
      const mockData = [
        { id: 1, amount: "3200", source: "Main Job" },
        { id: 2, amount: "450", source: "Freelance" },
      ];
      setStreams(mockData);
      setLoading(false);
    };

    fetchExistingIncome();
  }, []);

  const handleUpdate = (index: number, field: keyof IncomeStream, value: string) => {
    const newStreams = [...streams];
    if (field === "amount" || field === "source") {
      newStreams[index][field] = value;
    }
    setStreams(newStreams);
  };

  const handleSaveUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending Updates to Backend:", streams);
    if (onBack) {
      onBack();
    }
  };

  if (loading) return <div className="text-white text-center p-10">Loading your income data...</div>;

  return (
    <div className={`${incomeStyles.card} mx-auto w-full max-w-md`}>
      <h2 className={`${incomeStyles.title} text-center`}>Update Monthly Income</h2>
      <h3 className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-6 text-center">
        Edit Current Sources
      </h3>

      <form onSubmit={handleSaveUpdate} className={incomeStyles.form}>
        {streams.map((stream, index) => (
          <div key={stream.id} className="flex gap-3 mb-4 p-3 rounded-lg border border-slate-700 bg-slate-700/30 text-left">
            <div className="flex-1">
              <label className={incomeStyles.label}>Amount</label>
              <input
                type="number"
                className={incomeStyles.input}
                value={stream.amount}
                onChange={(e) => handleUpdate(index, "amount", e.target.value)}
              />
            </div>
            <div className="flex-[2]">
              <label className={incomeStyles.label}>Source</label>
              <input
                type="text"
                className={incomeStyles.input}
                value={stream.source}
                onChange={(e) => handleUpdate(index, "source", e.target.value)}
              />
            </div>
          </div>
        ))}

        <button type="submit" className={`${incomeStyles.button} mt-4`}>
          Confirm Changes
        </button>
      </form>

      <div className="mt-6 text-center border-t border-slate-700/50 pt-4">
        <button 
          type="button" 
          onClick={(e) => {
            e.preventDefault();
            if (onBack) onBack();
          }}
          className="text-slate-500 text-sm hover:text-white transition-colors"
        >
          Back to Summary
        </button>
      </div>
    </div>
  );
}