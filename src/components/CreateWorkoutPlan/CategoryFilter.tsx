// Category filter chips for the workout plan builder

const CATEGORIES = [
  "All",
  "Strength",
  "Cardio",
  "HIIT",
  "Yoga",
  "Flexibility",
  "Calisthenics",
  "Boxing",
  "Powerlifting",
];

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => {
        const active = selected === cat;
        return (    
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              active
                ? "bg-[#5B5EF4] text-white border-[#5B5EF4]"
                : "bg-white text-[#72728A] border-[#E6E6EE] hover:border-[#5B5EF4]"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}