import { Smile } from "lucide-react";

type MoodSelectorProps = {
  value: number;
  onChange: (value: number) => void;
};


const MoodSelector = ({ value, onChange }: MoodSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-2">
        <Smile className="text-indigo-500" />
        <p className="font-medium ">How are you feeling today?</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`w-12 h-12 rounded-xl border font-medium transition ${value === num
                ? "bg-indigo-500 text-white border-indigo-500"
                : "bg-white text-black border-gray-200 hover:border-indigo-400"
              }`}
          >
            {num}
          </button>
        ))}
        </div>

        <div className="flex justify-between mx-8 text-xs font-bold">
          <p>Very Low</p>
          <p>Neutral</p>
          <p>Excellent</p>
        </div>
      </div>
  );
};

export default MoodSelector;
