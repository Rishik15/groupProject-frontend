import { useEffect, useState, useCallback, useMemo } from "react";
import { Input, Button, Chip, Pagination } from "@heroui/react";
import CoachCard, { SkeletonCard } from "./CoachCard";
import FilterPanel from "../BrowseCoaches/FilterPanel";
import { searchCoaches } from "../../services/filtering/searchcoaches";
import type { CoachQuery } from "../../utils/Interfaces/coachquery";
import type { Coach } from "../../utils/Interfaces/coachquery";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { CircleAlert } from "lucide-react";

const MAX_PRICE_LIMIT = 300;
const COACHES_PER_PAGE = 6;

export default function BrowseCoaches() {
  const [nameSearch, setNameSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_LIMIT);
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

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

    const { coaches } = await searchCoaches(query);

    setCoaches(coaches);
    setPage(1);
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
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(coaches.length / COACHES_PER_PAGE));

  const paginatedCoaches = useMemo(() => {
    const start = (page - 1) * COACHES_PER_PAGE;
    return coaches.slice(start, start + COACHES_PER_PAGE);
  }, [coaches, page]);

  const startItem =
    coaches.length === 0 ? 0 : (page - 1) * COACHES_PER_PAGE + 1;

  const endItem = Math.min(page * COACHES_PER_PAGE, coaches.length);

  const activeFilterCount =
    selectedTags.length +
    (minRating !== 0 ? 1 : 0) +
    (maxPrice !== MAX_PRICE_LIMIT ? 1 : 0) +
    (certifiedOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-default-100 px-38 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[#72728A] hover:text-black mb-4 transition-colors"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-1">
        Browse Expert Coaches
      </h1>

      <p className="text-sm text-[#72728A] mb-5">
        Find the perfect coach for your fitness journey
      </p>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-default-400 pointer-events-none" />

          <Input
            placeholder="Search by name or specialty..."
            data-testid="search"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>

        <Button
          variant={showFilterPanel ? "primary" : "ghost"}
          onPress={() => setShowFilterPanel((v) => !v)}
          className={showFilterPanel ? "bg-[#5B5EF4] text-white" : "bg-white"}
          data-testid="filters"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {loading ? (
              [0, 1, 2, 3, 4, 5].map((i) => <SkeletonCard key={i} />)
            ) : coaches.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                  <CircleAlert className="w-8 h-8" />
                </div>

                <p className="text-sm font-medium text-foreground">
                  No coaches found
                </p>

                <p className="text-xs text-default-400 mt-1">
                  Try adjusting your filters or search
                </p>
              </div>
            ) : (
              paginatedCoaches.map((coach, i) => (
                <CoachCard key={coach.coach_id ?? i} coach={coach} />
              ))
            )}
          </div>

          {!loading && coaches.length > COACHES_PER_PAGE && (
            <div className="mt-8">
              <Pagination className="w-full">
                <Pagination.Summary>
                  Showing {startItem}-{endItem} of {coaches.length} coaches
                </Pagination.Summary>

                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous
                      isDisabled={page === 1}
                      onPress={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <Pagination.PreviousIcon />
                      <span>Previous</span>
                    </Pagination.Previous>
                  </Pagination.Item>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Pagination.Item key={p}>
                        <Pagination.Link
                          isActive={p === page}
                          onPress={() => setPage(p)}
                        >
                          {p}
                        </Pagination.Link>
                      </Pagination.Item>
                    ),
                  )}

                  <Pagination.Item>
                    <Pagination.Next
                      isDisabled={page === totalPages}
                      onPress={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      <span>Next</span>
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
