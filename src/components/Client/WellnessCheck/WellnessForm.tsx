import React, { useState } from "react";
import { Button, Card, Input, Label, TextArea, TextField } from "@heroui/react";
import MoodSelector from "./MoodSelector";
import { File, Moon, Weight } from "lucide-react";

type WellnessFormProps = {
  moodScore: number;
  setMoodScore: React.Dispatch<React.SetStateAction<number>>;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => Promise<void>;
  loading: boolean;
};

const WellnessForm = ({
  moodScore,
  setMoodScore,
  notes,
  setNotes,
  onSubmit,
  loading,
}: WellnessFormProps) => {
  const [weight, setWeight] = useState("");
  const [sleep, setSleep] = useState("");

  const handleWeightChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setWeight(value);
    }
  };

  const handleSleepChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setSleep(value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sleepNumber = Number(sleep);

    if (sleep && (sleepNumber < 0 || sleepNumber > 24)) {
      return;
    }

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <MoodSelector value={moodScore} onChange={setMoodScore} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#5B5EF4]">
              <Weight className="h-5 w-5" />
            </span>

            <div>
              <p className="text-sm font-semibold text-[#202020]">
                Daily Weight
              </p>
              <p className="text-xs text-gray-500">lbs</p>
            </div>
          </div>

          <Input
            fullWidth
            variant="secondary"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            placeholder="0.00"
            inputMode="decimal"
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm shadow-none outline-none focus-visible:border-[#5B5EF4] focus-visible:ring-2 focus-visible:ring-[#5B5EF4]/20"
          />
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#5B5EF4]">
              <Moon className="h-5 w-5" />
            </span>

            <div>
              <p className="text-sm font-semibold text-[#202020]">Sleep</p>
              <p className="text-xs text-gray-500">Duration in hours</p>
            </div>
          </div>

          <Input
            fullWidth
            variant="secondary"
            value={sleep}
            onChange={(e) => handleSleepChange(e.target.value)}
            placeholder="0"
            inputMode="decimal"
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm shadow-none outline-none focus-visible:border-[#5B5EF4] focus-visible:ring-2 focus-visible:ring-[#5B5EF4]/20"
          />
        </Card>
      </div>

      <TextField className="w-full">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-[#5B5EF4]">
            <File className="h-4 w-4" />
          </span>

          <Label className="text-sm font-semibold text-[#202020]">
            Note
            <span className="ml-1 font-normal text-gray-400">(Optional)</span>
          </Label>
        </div>

        <TextArea
          placeholder="Write anything you want to remember about today..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm shadow-none outline-none focus-visible:border-[#5B5EF4] focus-visible:ring-2 focus-visible:ring-[#5B5EF4]/20"
        />
      </TextField>

      <Button
        type="submit"
        isDisabled={loading}
        className="h-11 w-full rounded-xl bg-[#5B5EF4] text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-[#4A4DE8] disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Survey"}
      </Button>
    </form>
  );
};

export default WellnessForm;
