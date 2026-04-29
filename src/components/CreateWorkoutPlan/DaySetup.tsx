import { useState } from "react";

interface DaySetupProps {
  onConfirm: (planName: string, days: string[]) => void;
}

export default function DaySetup({ onConfirm }: DaySetupProps) {
  const [step, setStep] = useState<"name" | "count" | "days">("name");
  const [planName, setPlanName] = useState("");
  const [dayLabels, setDayLabels] = useState<string[]>([]);

  function handleNameNext() {
    if (!planName.trim()) return;
    setStep("count");
  }

  function handleCountSelect(count: number) {
    setDayLabels(Array.from({ length: count }, (_, i) => `Day ${i + 1}`));
    setStep("days");
  }

  function handleLabelChange(index: number, value: string) {
    setDayLabels((prev) =>
      prev.map((label, i) => (i === index ? value : label)),
    );
  }

  function handleConfirm() {
    const cleanedLabels = dayLabels.map((day) => day.trim());

    if (cleanedLabels.some((day) => !day)) return;

    onConfirm(planName.trim(), cleanedLabels);
  }

  return (
    <div className="flex flex-col gap-5">
      {step === "name" && (
        <>
          <div>
            <p className="text-sm font-semibold text-black">
              Workout Plan Name
            </p>
            <p className="text-xs text-[#72728A] mt-1">
              Start by naming your workout plan.
            </p>
          </div>

          <input
            autoFocus
            type="text"
            placeholder="Example: My PPL Plan"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4]"
          />

          <button
            onClick={handleNameNext}
            disabled={!planName.trim()}
            className="w-full bg-[#5B5EF4] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#4B4EE4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </>
      )}

      {step === "count" && (
        <>
          <div>
            <p className="text-sm font-semibold text-black">
              How many workout days?
            </p>
            <p className="text-xs text-[#72728A] mt-1">
              Pick how many days this plan should have.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((count) => (
              <button
                key={count}
                onClick={() => handleCountSelect(count)}
                className="h-12 rounded-2xl border border-[#E6E6EE] text-sm font-semibold text-black hover:border-[#5B5EF4] hover:text-[#5B5EF4] transition-colors"
              >
                {count}
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep("name")}
            className="text-xs text-[#72728A] hover:text-black transition-colors"
          >
            Back
          </button>
        </>
      )}

      {step === "days" && (
        <>
          <div>
            <p className="text-sm font-semibold text-black">Name each day</p>
            <p className="text-xs text-[#72728A] mt-1">
              Example: Push, Pull, Legs, Upper, Lower.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {dayLabels.map((label, index) => (
              <input
                key={index}
                value={label}
                onChange={(e) => handleLabelChange(index, e.target.value)}
                className="w-full text-sm border border-[#E6E6EE] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#5B5EF4]"
              />
            ))}
          </div>

          <button
            onClick={handleConfirm}
            disabled={dayLabels.some((day) => !day.trim())}
            className="w-full bg-[#5B5EF4] text-white text-sm font-medium py-2.5 rounded-xl hover:bg-[#4B4EE4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Start Building
          </button>

          <button
            onClick={() => setStep("count")}
            className="text-xs text-[#72728A] hover:text-black transition-colors"
          >
            Back
          </button>
        </>
      )}
    </div>
  );
}
