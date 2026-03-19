import { useEffect, useState, useCallback } from "react";
import axios from 'axios';
import {
  Card,
  Input,
  Button,
  Chip,
  Checkbox,
  Slider
} from "@nextui-org/react";
import CoachCard, { SkeletonCard, type Coach } from "./CoachCard";

/*
"name": "Sam",
  "tags": ["Strength", "HIIT"],
  "certified": true,
  "max_price": 50.0,
  "rating": 4.5,
  "sort_by": "rating"

*/
export interface CoachQuery {
  name: string;
  tags: string[];
  certified: boolean;
  max_price: number | null;
  rating: number | null;
  sort_by: string;
}

const BASE_URL = "http://localhost:8080";

// coach specialties
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

// props passed down from BrowseCoaches to filter panel to read and update filter state
interface FilterPanelProps {
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

function FilterPanel({
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
        <Button variant="light" size="sm" onPress={onClearAll} className="text-default-400 min-w-0 px-0">
          Clear all
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-default-500 uppercase tracking-wider">Specialty</span>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <Chip
                key={tag}
                variant={active ? "solid" : "bordered"}
                color={active ? "primary" : "default"}
                size="sm"
                className="cursor-pointer"
                onClick={() => onTagToggle(tag)}
              >
                {tag}
              </Chip>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-default-500 uppercase tracking-wider">Min Rating</span>
        <div className="flex gap-2 flex-wrap">
          {RATINGS.map(({ label, value }) => {
            const active = minRating === value;
            return (
              <Chip
                key={label}
                variant={active ? "solid" : "bordered"}
                color={active ? "primary" : "default"}
                size="sm"
                className="cursor-pointer"
                onClick={() => onMinRatingChange(value)}
              >
                {label}
              </Chip>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-default-500 uppercase tracking-wider">Max Price / Session</span>
          <span className="text-xs text-default-400">
          {maxPrice === MAX_PRICE_LIMIT ? "Any price" : `Up to $${maxPrice}`}
        </span>
    <Slider
      minValue={0}
      maxValue={MAX_PRICE_LIMIT}
      step={5}
      value={maxPrice}
      onChange={(v) => onMaxPriceChange(Array.isArray(v) ? v[0] : v)}
      color="primary"
      size="sm"
    />
  </div>

      <Checkbox
        isSelected={certifiedOnly}
        onValueChange={onCertifiedOnlyChange}
        size="sm"
      >
        <span className="text-sm text-default-600">Certified only</span>
      </Checkbox>
    </Card>
  );
}

export default function BrowseCoaches() {
  const [nameSearch, setNameSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_LIMIT);
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  /*
"name": "Sam",
  "tags": ["Strength", "HIIT"],
  "certified": true,
  "max_price": 50.0,
  "rating": 4.5,
  "sort_by": "rating"

*/

  // exact payload sent to flask on every filter change
  const query: CoachQuery = {
    name: nameSearch.trim(),
    tags: selectedTags,
    certified: certifiedOnly,
    max_price: maxPrice,
    rating: minRating,
    sort_by: "rating",
  };

// this will fire an api call on every filter change
const loadCoaches = useCallback(async () => {
  setLoading(true);
  const { data } = await axios.post(`${BASE_URL}/api/coaches/search`, query);
  setCoaches(data.coaches);
  setCount(data.count);
  setLoading(false);
}, [selectedTags, minRating, maxPrice, certifiedOnly, nameSearch]);

  useEffect(() => { loadCoaches(); }, [loadCoaches]);

  // adds or removes a tag from the selected tags list when clicked
  function handleTagToggle(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  // resets everything back to 0 when filters are reset.
  function handleClearAll() {
    setNameSearch("");
    setSelectedTags([]);
    setMinRating(0);
    setMaxPrice(0);
    setCertifiedOnly(false);
  }

  return (
    <div className="min-h-screen bg-default-100 px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-5">Browse Expert Coaches</h1>
      <div className="flex items-center gap-3 mb-6">
        <Input
          placeholder="Search by name or specialty..."
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          onClear={() => setNameSearch("")}
          isClearable
          startContent={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-default-400">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          }
          className="max-w-lg"
          classNames={{ inputWrapper: "bg-white shadow-sm" }}
        />
        <Button
          variant={showFilterPanel ? "solid" : "bordered"}
          color={showFilterPanel ? "primary" : "default"}
          onPress={() => setShowFilterPanel((v) => !v)}
          startContent={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="11" y1="18" x2="13" y2="18" />
            </svg>
          }

          className="bg-white"
        >
          Filters
        </Button>
      </div>

      <div className="flex gap-6 items-start">

        {showFilterPanel && (
          <div className="w-72 shrink-0">
            <FilterPanel
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              certifiedOnly={certifiedOnly}
              onCertifiedOnlyChange={setCertifiedOnly}
              onClearAll={handleClearAll}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
        {!loading && (
          <p className="text-sm text-default-500 mb-4">
            {count} {count === 1 ? "coach" : "coaches"} found
          </p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : coaches.length === 0 ? (
            <p className="text-sm text-default-400">No coaches found.</p>
          ) : (
            coaches.map((coach) => <CoachCard key={coach.id} coach={coach} />)
          )}
        </div>        
        </div>
      </div>
    </div>
  );
}