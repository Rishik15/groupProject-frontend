import { useEffect, useState, useCallback } from "react";
import { Input, Button, Chip } from "@heroui/react";
import CoachCard, {
  SkeletonCard,
} from "../../components/LandingPage/CoachCard";
import FilterPanel from "../../components/client/CoachFiltering/FilterPanel";
import { searchCoaches } from "../../services/filtering/searchcoaches";
import type { CoachQuery } from "../../utils/Interfaces/coachquery";
import type { Coach } from "../../utils/Interfaces/coachquery";

const MAX_PRICE_LIMIT = Number.MAX_SAFE_INTEGER;

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

  

  const loadCoaches = useCallback(async () => {
    setLoading(true);
    const query: CoachQuery = {
    name: nameSearch.trim(),
    filters: selectedTags,
    is_certified: certifiedOnly,
    max_price: maxPrice,
    min_rating: minRating,
    sort_by: "rating",
  };
    const { coaches, count } = await searchCoaches(query);
    setCoaches(coaches);
    setCount(count);
    setLoading(false);
  }, [nameSearch, selectedTags, minRating, maxPrice, certifiedOnly]);

  useEffect(() => {
    loadCoaches();
  }, [loadCoaches]);

  function handleTagToggle(tag: string) {
    console.log("toggling tag:", tag);
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function handleClearAll() {
    setNameSearch("");
    setSelectedTags([]);
    setMinRating(0);
    setMaxPrice(MAX_PRICE_LIMIT);
    setCertifiedOnly(false);
  }

  const activeFilterCount =
    selectedTags.length +
    (minRating !== 0 ? 1 : 0) +
    (maxPrice !== MAX_PRICE_LIMIT ? 1 : 0) +
    (certifiedOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-default-100 px-8 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-1">Browse Expert Coaches</h1>
      <p className="text-sm text-[#72728A] mb-5">Find the perfect coach for your fitness journey</p>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-default-200 rounded-xl px-3 py-2 max-w-lg flex-1">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-default-400 shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <Input
            placeholder="Search by name or specialty..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="border-none outline-none bg-transparent flex-1"
          />
        </div>
        <Button
          variant={showFilterPanel ? "primary" : "ghost"}
          onPress={() => setShowFilterPanel((v) => !v)}
          className="bg-white"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="11" y1="18" x2="13" y2="18" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <Chip size="sm" className="min-w-0 h-4 text-xs px-1">
              {activeFilterCount}
            </Chip>
          )}
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
              [0, 1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
            ) : coaches.length === 0 ? (
              <p className="text-sm text-default-400">No coaches found.</p>
            ) : (
              coaches.map((coach, i) => (
                <CoachCard key={coach.coach_id ?? i} coach={coach} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
