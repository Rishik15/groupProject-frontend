import { useMemo, useState } from "react";
import { Button, Card, Input, Spinner } from "@heroui/react";
import { Coins, Crown, Medal, Trophy } from "lucide-react";
import type { PredictionLeaderboardEntry } from "../../../utils/Interfaces/Predictions/predictionLeaderboard";

type PredictionLeaderboardListProps = {
  entries: PredictionLeaderboardEntry[];
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  onRetry?: () => void;
  currentUserId?: number | null;
  pageSize?: number;
};

function formatPoints(value?: number | null) {
  return new Intl.NumberFormat().format(value ?? 0);
}

function normalizeEntries(entries: PredictionLeaderboardEntry[]) {
  return [...entries]
    .sort(
      (a, b) =>
        (a.rank ?? Number.MAX_SAFE_INTEGER) -
        (b.rank ?? Number.MAX_SAFE_INTEGER),
    )
    .map((entry, index) => ({
      ...entry,
      rank: typeof entry.rank === "number" ? entry.rank : index + 1,
    }));
}

function getRankIcon(rank: number) {
  if (rank === 1) return Crown;
  if (rank === 2) return Medal;
  return Trophy;
}

function getRankClass(rank: number) {
  if (rank === 1) return "bg-amber-50 text-amber-700 border-amber-200";
  if (rank === 2) return "bg-slate-100 text-slate-700 border-slate-200";
  if (rank === 3) return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-default-50 text-foreground border-default-200";
}

export default function PredictionLeaderboardList({
  entries,
  isLoading = false,
  error = null,
  title = "Leaderboard",
  onRetry,
  currentUserId = null,
  pageSize = 8,
}: PredictionLeaderboardListProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const normalized = useMemo(() => normalizeEntries(entries), [entries]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return normalized;

    return normalized.filter((entry) =>
      entry.name.toLowerCase().includes(query),
    );
  }, [normalized, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return filtered.slice(startIndex, startIndex + pageSize);
  }, [filtered, pageSize, safePage]);

  const currentUserEntry = useMemo(() => {
    if (currentUserId == null) return null;
    return normalized.find((entry) => entry.user_id === currentUserId) ?? null;
  }, [normalized, currentUserId]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  return (
    <Card className="border border-default-200 bg-white shadow-sm">
      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-[18.75px] font-semibold text-foreground">
              {title}
            </h3>
            <p className="mt-1 text-[13.125px] text-foreground/60">
              Ranked by current wallet balance.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name"
              variant="primary"
              className="min-w-[240px]"
            />
            {onRetry ? (
              <Button
                variant="outline"
                onPress={onRetry}
                isDisabled={isLoading}
              >
                Refresh
              </Button>
            ) : null}
          </div>
        </div>

        {currentUserEntry ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-[#5B5EF4]/20 bg-[#5B5EF4]/5 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11.25px] font-semibold uppercase tracking-[0.18em] text-[#5B5EF4]">
                Your position
              </p>
              <p className="mt-1 text-[18.75px] font-semibold text-foreground">
                #{currentUserEntry.rank} • {currentUserEntry.name}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[#5B5EF4] shadow-sm">
              <Coins className="h-4 w-4" strokeWidth={2.2} />
              <span className="text-[13.125px] font-semibold">
                {formatPoints(currentUserEntry.balance)} points
              </span>
            </div>
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-default-200 bg-default-50">
            <div className="flex flex-col items-center gap-3 text-center">
              <Spinner size="md" />
              <p className="text-[13.125px] text-foreground/60">
                Loading leaderboard…
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-danger/20 bg-danger/5 p-5 text-[13.125px] text-danger-700">
            <p className="font-medium">Unable to load leaderboard.</p>
            <p className="mt-1 opacity-80">{error}</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-default-300 bg-default-50 p-8 text-center">
            <p className="text-[13.125px] text-foreground/60">
              No leaderboard entries match your search.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paginated.map((entry) => {
              const rank = entry.rank as number;
              const RankIcon = getRankIcon(rank);

              return (
                <div
                  key={entry.user_id}
                  className="flex flex-col gap-4 rounded-2xl border border-default-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${getRankClass(rank)}`}
                    >
                      <RankIcon className="h-5 w-5" strokeWidth={2.2} />
                    </div>

                    <div>
                      <span className="text-[11.25px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
                        Rank #{rank}
                      </span>
                      <p className="mt-1 text-base font-semibold text-foreground">
                        {entry.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-[#5B5EF4]/10 px-3 py-2 text-[#5B5EF4]">
                    <Coins className="h-4 w-4" strokeWidth={2.2} />
                    <span className="text-[13.125px] font-semibold">
                      {formatPoints(entry.balance)} points
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 ? (
          <div className="flex flex-col gap-3 border-t border-default-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13.125px] text-foreground/55">
              Page {safePage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                isDisabled={safePage <= 1}
                onPress={() => setPage((previous) => Math.max(1, previous - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                isDisabled={safePage >= totalPages}
                onPress={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
