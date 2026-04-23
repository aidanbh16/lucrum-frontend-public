"use client";

import { useState } from "react";
import { incomeStyles } from "@/styles/income";


type Stream = {
  source: string;
  amount: string;
};

export default function MyIncome() {
  const [saved, setSaved] = useState<Stream[]>([]);

  const [streams, setStreams] = useState<Stream[]>([
    { source: "", amount: "" },
  ]);

  const total = saved.reduce(
    (sum, s) => sum + (parseFloat(s.amount) || 0),
    0
  );

  const handleSave = () => {
    const filtered = streams.filter(s => s.source.trim() !== "" || s.amount.trim() !== "");
    setSaved(filtered);
  };

  const updateStream = (index: number, field: keyof Stream, value: string) => {
    let newStreams = [...streams];
    newStreams[index] = { ...newStreams[index], [field]: value };

    newStreams = newStreams.filter(
      (s) => s.source.trim() !== "" || s.amount.trim() !== ""
    );

    newStreams.push({ source: "", amount: "" });

    setStreams(newStreams);
  };

  return (
    <div className={incomeStyles.pageWrapper}>

      <div className={incomeStyles.sectionWrapper}>
        <div className={`${incomeStyles.card} flex flex-col`}>
          <h2 className={incomeStyles.title} style={{ textAlign: 'center' }}>Monthly Summary</h2>

          <div className="mt-4 space-y-2">
            {saved.map((s, i) => (
                <div key={i} className="w-full">
                    <div className={`${incomeStyles.input} w-full text-lg flex items-center`}>
                    {s.source || "Unknown Source"}
                    </div>
                </div>
            ))}
          </div>

          <div className="flex-grow flex flex-col justify-end mt-6 pb-2.5">
            <p 
              className={`${incomeStyles.label} items-center`} 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
            >
              Total Monthly: <span className={incomeStyles.totalText} style={{ lineHeight: 1 }}>${total.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className={incomeStyles.card}>
          <h2 className={incomeStyles.title} style={{ textAlign: 'center' }}>Manage Sources</h2>

          <div className="mt-6 space-y-4">
            {streams.map((stream, index) => (
              <div key={index} className="flex items-center gap-3 w-full">
                <input
                  className={`${incomeStyles.input} flex-grow`}
                  placeholder="Income source"
                  value={stream.source}
                  onChange={(e) => updateStream(index, 'source', e.target.value)}
                />

                <input
                  className={`${incomeStyles.input} w-32 flex-shrink-2 text-right`}
                  style={{ textAlign: 'right' }}
                  placeholder="0.00"
                  type="number"
                  value={stream.amount}
                  onChange={(e) => updateStream(index, 'amount', e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="mt-10">
            <button className={incomeStyles.button} onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}