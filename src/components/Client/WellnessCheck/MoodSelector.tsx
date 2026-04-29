import { Button } from "@heroui/react";
import { Smile } from "lucide-react";

type MoodSelectorProps = {
  value: number;
  onChange: (value: number) => void;
};

const moods = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const MoodSelector = ({ value, onChange }: MoodSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[#5B5EF4]">
          <Smile className="h-5 w-5" />
        </span>

        <div>
          <p className="text-sm font-semibold text-[#202020]">
            How are you feeling today?
          </p>
          <p className="text-xs text-gray-500">Choose a number from 1 to 10.</p>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-2">
        {moods.map((num) => {
          const active = value === num;

          return (
            <Button
              key={num}
              type="button"
              onPress={() => onChange(num)}
              className={`!h-11 !w-11 !min-w-11 !rounded-xl !border !p-0 text-sm font-semibold transition-colors ${
                active
                  ? "!border-[#5B5EF4] !bg-[#5B5EF4] !text-white"
                  : "!border-gray-200 !bg-white !text-gray-700 hover:!border-[#5B5EF4] hover:!bg-indigo-50"
              }`}
            >
              {num}
            </Button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 px-1 text-[11px] font-semibold text-gray-500">
        <p>Very Low</p>
        <p className="text-center">Neutral</p>
        <p className="text-right">Excellent</p>
      </div>
    </div>
  );
};

export default MoodSelector;
