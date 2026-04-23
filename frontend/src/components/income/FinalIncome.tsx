"use client";

import { useState } from "react";
import { incomeStyles } from "@/styles/income";

interface IncomeStream {
  id: number | string;
  amount: string;
  source: string;
}

export default function CenterSideBySideIncome() {
  // Start with no saved income streams
  const [committedStreams, setCommittedStreams] = useState<IncomeStream[]>([]);

  // Start with one empty editable row
  const [editingStreams, setEditingStreams] = useState<IncomeStream[]>([
    { id: Date.now(), amount: "", source: "" },
  ]);

  const total = committedStreams.reduce(
    (acc, curr) => acc + (parseFloat(curr.amount) || 0),
    0
  );

  const handleUpdateStream = (
    index: number,
    field: keyof IncomeStream,
    value: string
  ) => {
    const newEditingStreams = [...editingStreams];

    newEditingStreams[index] = {
      ...newEditingStreams[index],
      [field]: value,
    };

    const isLastRow = index === editingStreams.length - 1;
    if (isLastRow && value.trim() !== "") {
      newEditingStreams.push({
        id: `${Date.now()}-${index}`,
        amount: "",
        source: "",
      });
    }

    setEditingStreams(newEditingStreams);
  };

  const handleSave = () => {
    const cleaned = editingStreams.filter(
      (stream) => stream.source.trim() !== "" && stream.amount.trim() !== ""

    );

    setCommittedStreams(cleaned);
    setEditingStreams([
      ...cleaned,
      { id: Date.now(), amount: "", source: "" },
    ]);

    // Later, backend hookup would usually go here:
    // await fetch("/api/income", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(cleaned),
    // });
  };

  return (
    <div className="w-full">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-stretch justify-center gap-8 lg:flex-row">
        <div className={`${incomeStyles.card} flex min-h-[520px] flex-1 flex-col`}>
          <h2 className={`${incomeStyles.title} mb-8 text-center`}>
            Monthly Summary
          </h2>

          <div className="flex-grow space-y-4">
            {committedStreams.length === 0 ? (
              <div className="flex h-[64px] items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800 p-4 text-slate-400">
                No income sources added yet.
              </div>
            ) : (
              committedStreams.map(
                (stream) =>
                  (stream.source || stream.amount) && (
                    <div
                      key={stream.id}
                      className="flex h-[64px] items-center justify-between rounded-xl border border-slate-600/50 bg-slate-800 p-4"
                    >
                      <span className="truncate pr-3 text-lg font-medium text-slate-300">
                        {stream.source}
                      </span>
                      <span className="text-2xl font-bold text-emerald-400">
                        ${(parseFloat(stream.amount) || 0).toLocaleString()}
                      </span>
                    </div>
                  )
              )
            )}
          </div>

          <div className="mt-8 flex h-[60px] items-center justify-between border-t border-slate-700 pt-6">
            <span className="text-lg font-semibold text-white">
              Total Monthly:
            </span>
            <span className="text-3xl font-black text-emerald-400">
              ${total.toLocaleString()}
            </span>
          </div>
        </div>

        <div
          className={`${incomeStyles.card} flex min-h-[520px] flex-1 flex-col border-emerald-500/10 shadow-2xl shadow-black/50`}
        >
          <h2 className={`${incomeStyles.title} mb-8 text-center text-emerald-400`}>
            Manage Sources
          </h2>

          <div className="custom-scrollbar max-h-[360px] flex-grow space-y-4 overflow-y-auto pr-1">
            {editingStreams.map((stream, index) => (
              <div key={stream.id} className="flex h-[64px] w-full items-center gap-3">
                <div className="h-full flex-[2] rounded-xl border border-slate-700 bg-slate-950 transition-all focus-within:border-emerald-500/40">
                  <input
                    type="text"
                    placeholder="Where from?"
                    className="h-full w-full bg-transparent px-4 text-base text-slate-200 placeholder:text-slate-600 focus:outline-none"
                    value={stream.source}
                    onChange={(e) =>
                      handleUpdateStream(index, "source", e.target.value)
                    }
                  />
                </div>

                <div className="h-full flex-1 rounded-xl border border-slate-700 bg-slate-950 transition-all focus-within:border-emerald-500/40">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="h-full w-full bg-transparent px-4 text-right text-lg font-bold text-emerald-400 placeholder:text-slate-700 focus:outline-none"
                    value={stream.amount}
                    onChange={(e) =>
                      handleUpdateStream(index, "amount", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-700 pt-6">
            <button
              onClick={handleSave}
              className="h-[56px] w-full rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 active:scale-[0.98]"
            >
              Confirm & Save Changes
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}