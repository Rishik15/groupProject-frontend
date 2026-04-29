import { Card, Checkbox } from "@heroui/react";

const SPECIALTIES = [
  "Strength", "HIIT", "Cardio", "Yoga", "Calisthenics", "Boxing",
  "Powerlifting", "Bodybuilding", "Weight Loss", "Flexibility",
  "Bulking", "Endurance", "Beginner", "Advanced",
];

const MAX_PRICE_LIMIT = 300;

const RATINGS = [
  { label: "Any", value: 0 },
  { label: "3+", value: 3 },
  { label: "3.5+", value: 3.5 },
  { label: "4+", value: 4 },
  { label: "4.5+", value: 4.5 },
];

export interface FilterPanelProps {
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  minRating: number;
  onMinRatingChange: (v: number) => void;
  maxPrice: number;
  onMaxPriceChange: (v: number) => void;
  certifiedOnly: boolean;
  onCertifiedOnlyChange: (v: boolean) => void;
  onClearAll: () => void;
}

export default function FilterPanel({
  selectedTags, onTagToggle,
  minRating, onMinRatingChange,
  maxPrice, onMaxPriceChange,
  certifiedOnly, onCertifiedOnlyChange,
  onClearAll,
}: FilterPanelProps) {
  return (
    <Card className="p-5 flex flex-col gap-6 h-fit sticky top-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Filters</span>
        <button
          onClick={onClearAll}
          className="text-xs text-default-400 hover:text-foreground transition-colors"
        >
          Clear all
        </button>
      </div>


      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-default-500 uppercase tracking-wider">
          Specialty
        </span>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                data-testid={tag}
                key={tag}
                onClick={() => onTagToggle(tag)}
                className="text-xs font-medium px-3 py-1 rounded-full border transition-colors"
                style={{
                  backgroundColor: active ? "#5B5EF4" : "transparent",
                  color: active ? "#ffffff" : "#72728A",
                  borderColor: active ? "#5B5EF4" : "#E6E6EE",
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>


      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-default-500 uppercase tracking-wider">
          Min Rating
        </span>
        <div className="flex gap-2 flex-wrap">
          {RATINGS.map(({ label, value }) => {
            const active = minRating === value;
            return (
              <button
                data-testid={label}
                key={label}
                onClick={() => onMinRatingChange(value)}
                className="text-xs font-medium px-3 py-1 rounded-full border transition-colors"
                style={{
                  backgroundColor: active ? "#5B5EF4" : "transparent",
                  color: active ? "#ffffff" : "#72728A",
                  borderColor: active ? "#5B5EF4" : "#E6E6EE",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

 
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-default-500 uppercase tracking-wider">
          Max Price / Session
        </span>
        <span className="text-xs text-default-400">
          {maxPrice === MAX_PRICE_LIMIT ? "Any price" : `Up to $${maxPrice}`}
        </span>
        <input
          data-testid="max_price"
          type="range"
          min={0}
          max={MAX_PRICE_LIMIT}
          step={5}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-[#5B5EF4]"
        />
      </div>

     
      <Checkbox isSelected={certifiedOnly} onChange={onCertifiedOnlyChange} data-testid="checkbox">
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Content>
          <span className="text-sm text-default-600">Certified only</span>
        </Checkbox.Content>
      </Checkbox>
    </Card>
  );
}