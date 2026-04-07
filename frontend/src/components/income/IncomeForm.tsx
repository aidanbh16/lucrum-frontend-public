"use client";
import { useState } from "react";
import { incomeStyles } from "@/styles/income";

interface IncomeStream {
  amount: string;
  source: string;
}

interface IncomeFormProps {
  onSuccess?: () => void;
}

export default function IncomeForm({ onSuccess }: IncomeFormProps) {
  const [streams, setStreams] = useState<IncomeStream[]>([{ amount: "", source: "" }]);

  const handleUpdateStream = (index: number, field: keyof IncomeStream, value: string) => {
    const newStreams = [...streams];
    newStreams[index][field] = value;
    setStreams(newStreams);

    if (index === streams.length - 1 && value.trim() !== "") {
      setStreams([...newStreams, { amount: "", source: "" }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = streams.filter(s => s.amount || s.source);
    console.log("Saving All Streams:", dataToSave);
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className={`${incomeStyles.card} mx-auto w-full max-w-md`}>
      <h2 className={`${incomeStyles.title} text-center`}>Add Monthly Income</h2>
      
      <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6 text-center">
        Add Sources
      </h3>

      <form onSubmit={handleSubmit} className={incomeStyles.form}>
        {streams.map((stream, index) => (
          <div key={index} className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className={`${incomeStyles.label} pl-2`}>Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                className={incomeStyles.input}
                value={stream.amount}
                onChange={(e) => handleUpdateStream(index, "amount", e.target.value)}
              />
            </div>
            <div className="flex-[2]">
              <label className={`${incomeStyles.label} pl-2`}>Where from?</label>
              <input
                type="text"
                placeholder="ex: Freelance"
                className={incomeStyles.input}
                value={stream.source}
                onChange={(e) => handleUpdateStream(index, "source", e.target.value)}
              />
            </div>
          </div>
        ))}

        <button type="submit" className={`${incomeStyles.button} mt-4`}>
          Save
        </button>
      </form>
    </div>
  );
}