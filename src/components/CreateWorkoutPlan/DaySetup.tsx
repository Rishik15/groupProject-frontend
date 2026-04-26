import { useState } from "react";

interface Props {
  onConfirm: (planName: string, days: string[]) => void;
}

export default function DaySetup({ onConfirm }: Props) {
  const [step, setStep] = useState<"name" | "count" | "days">("name");
  const [planName, setPlanName] = useState("");
  const [numDays, setNumDays] = useState<number | null>(null);
  const [dayLabels, setDayLabels] = useState<string[]>([]);

  function handleNameNext() {
    if (!planName.trim()) return;
    setStep("count");
  }

  function handleCountSelect(n: number) {
    setNumDays(n);
    setDayLabels(Array.from({ length: n }, (_, i) => `Day ${i + 1}`));
    setStep("days");
  }

  function handleConfirm() {
    if (dayLabels.some((d) => !d.trim())) return;
    onConfirm(planName.trim(), dayLabels);
  }

  return (
    <div className="flex flex-col gap-5 py-4">
      {step === "name" && (
        <>
          <div>
            <p className="text-sm font-semibold text-black">Workout Plan Name</p>
            <p className="text-xs text-[#72728A] mt-0.5">Give your plan a name</p>
          </div>
          <input
            autoFocus
            placeholder="e.g. My PPL Plan"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4]"
          />
          <button onClick={handleNameNext} disabled={!planName.trim()}
            className="w-full bg-[#5B5EF4] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#4B4EE4] disabled:opacity-40">
            Next
          </button>
        </>
      )}

      {step === "count" && (
        <>
          <div>
            <p className="text-sm font-semibold text-black">How many days?</p>
            <p className="text-xs text-[#72728A] mt-0.5">Pick the number of training days</p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <button key={n} onClick={() => handleCountSelect(n)}
                className="w-12 h-12 rounded-2xl border border-[#E6E6EE] text-sm font-semibold text-black hover:border-[#5B5EF4] hover:text-[#5B5EF4] transition-colors">
                {n}
              </button>
            ))}
          </div>
        </>
      )}

      {step === "days" && (
        <>
          <div>
            <p className="text-sm font-semibold text-black">Name each day</p>
            <p className="text-xs text-[#72728A] mt-0.5">e.g. Push, Pull, Legs</p>
          </div>
          <div className="flex flex-col gap-2">
            {dayLabels.map((label, i) => (
              <input key={i} value={label}
                onChange={(e) => setDayLabels((prev) => prev.map((d, j) => j === i ? e.target.value : d))}
                className="w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4]"
              />
            ))}
          </div>
          <button onClick={handleConfirm} disabled={dayLabels.some((d) => !d.trim())}
            className="w-full bg-[#5B5EF4] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#4B4EE4] disabled:opacity-40">
            Start Building
          </button>
        </>
      )}
    </div>
  );
}