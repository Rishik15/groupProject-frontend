import React from "react";

type MoodSelectorProps = {
    value: number;
    onChange: (value: number) => void;
};

const MoodSelector = ({ value, onChange }: MoodSelectorProps) => {
    return (
        <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                    key={num}
                    type="button"
                    onClick={() => onChange(num)}
                    className={`h-11 rounded-xl border font-medium transition ${
                        value === num
                            ? "bg-indigo-500 text-white border-indigo-500"
                            : "bg-white text-black border-gray-200 hover:border-indigo-400"
                    }`}
                >
                    {num}
                </button>
            ))}
        </div>
    );
};

export default MoodSelector;