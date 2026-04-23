import React from "react";
import { Button, Card, Input, Label, TextArea, TextField } from "@heroui/react";
import MoodSelector from "./MoodSelector";
import { Moon, Notebook, File, Weight } from "lucide-react";

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
        <MoodSelector value={moodScore} onChange={setMoodScore} />
      </div>


      <div className="flex flex-row gap-5">

        <Card className="mr-auto border h-35 w-full p-5">
          <div className="flex flex-row gap-2 ">
            <div className="w-fit rounded-lg p-1 bg-[#EBEBFD] text-indigo-500 mb-2">
              <Weight className="h-6 w-6" />
            </div>
            <div className="text-[11px] text-black">
              <p>Daily Weight</p>
              <p className="text-gray-500">(lbs)</p>
            </div>
          </div>
          <Input className="border border-gray-300" placeholder="0.00" step={0.01} type="number"></Input>
        </Card>

        <Card className="mr-auto border h-35 w-full p-5">
          <div className="flex flex-row gap-2 ">
            <div className="w-fit rounded-lg p-1 bg-white text-indigo-500 mb-2">
              <Moon className="h-6 w-6" />
            </div>
            <div className="text-[11px] text-black">
              <p>Sleep</p>
              <p className="text-gray-500">Duration (hours)</p>
            </div>
          </div>
          <Input className="border border-gray-300" placeholder="0" min={0} max={24} type="number"></Input>
        </Card>

      </div>


      <TextField className="w-full">
        <div className="flex gap-1">
          <File className="w-5 h-5 text-indigo-500" />
          <Label className="my-auto">Note (Optional)</Label>
        </div>
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
        className="rounded-xl w-full bg-indigo-500 hover:bg-indigo-400 text-white disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Survey"}
      </Button>
    </form>
  );
};

export default WellnessForm;
