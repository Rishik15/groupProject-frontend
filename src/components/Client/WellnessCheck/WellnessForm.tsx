import React from "react";
import { Button, Label, TextArea, TextField } from "@heroui/react";
import MoodSelector from "./MoodSelector";

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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="px-1 space-y-5"
    >
      <div>
        <Label className="mb-3 block">Mood Score (1–10)</Label>
        <MoodSelector value={moodScore} onChange={setMoodScore} />
      </div>

      <TextField className="w-full">
        <Label>Note</Label>
        <TextArea
          placeholder="Feeling good..."
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </TextField>

      <Button
        type="submit"
        isDisabled={loading}
        className="w-full bg-indigo-500 hover:bg-indigo-400 text-white disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Survey"}
      </Button>
    </form>
  );
};

export default WellnessForm;
