import { Button, Card } from "@heroui/react";
import { AlertCircle, Award, RefreshCw, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getActiveCoaches } from "../../../services/Admin/adminAccountModerationService";
import {
  formatAdminCurrency,
  formatAdminDateTime,
} from "../../../utils/Admin/adminFormatters";
import type { AdminActiveCoach } from "../../../utils/Interfaces/Admin/adminAccountModeration";

const ActiveCoachesTab = () => {
  const [coaches, setCoaches] = useState<AdminActiveCoach[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCoaches = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getActiveCoaches(signal);
      setCoaches(response.coaches ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      setError(
        err instanceof Error ? err.message : "Failed to load active coaches.",
      );
      setCoaches([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadCoaches(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredCoaches = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return coaches;

    return coaches.filter((coach) => {
      const values = [
        coach.name,
        coach.email,
        coach.first_name,
        coach.last_name,
        coach.coach_description,
      ];

      const certifications = coach.certifications.flatMap((certification) => [
        certification.cert_name,
        certification.provider_name,
      ]);

      return [...values, ...certifications].some((value) =>
        value?.toLowerCase().includes(query),
      );
    });
  }, [coaches, searchValue]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-default-900">
              Active Coaches
            </h2>
            <p className="mt-1 text-sm text-default-600">
              Review the current coach roster, pricing, certifications, and
              contract volume from the dedicated active coach endpoint.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search coaches by name, email, certification, or specialty"
              className="min-w-[280px] rounded-[16px] border border-default-200 px-4 py-2.5 text-sm outline-none transition focus:border-default-400"
            />
            <Button
              className={"bg-[#5B5EF4]"}
              onPress={() => void loadCoaches()}
            >
              <span className="inline-flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 p-6">
            <div>
              <p className="text-lg font-semibold text-default-900">
                Loading coaches
              </p>
              <p className="mt-1 text-sm text-default-600">
                Pulling active coach data, certifications, and contract totals.
              </p>
            </div>
            <RefreshCw className="h-5 w-5 animate-spin text-default-500" />
          </div>
        </Card>
      ) : error ? (
        <Card className="rounded-[24px] border border-danger/20 bg-white shadow-sm">
          <div className="flex items-start gap-3 p-6">
            <div className="rounded-full bg-danger/10 p-2 text-danger">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-default-900">
                Unable to load active coaches
              </p>
              <p className="mt-1 text-sm text-default-600">{error}</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredCoaches.length === 0 ? (
            <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm xl:col-span-2">
              <div className="p-6 text-sm text-default-600">
                No coaches matched your current search.
              </div>
            </Card>
          ) : (
            filteredCoaches.map((coach) => (
              <Card
                key={coach.user_id}
                className="rounded-[24px] border border-default-200 bg-white shadow-sm"
              >
                <div className="space-y-5 p-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-default-900">
                        {coach.name ||
                          `${coach.first_name ?? ""} ${coach.last_name ?? ""}`.trim() ||
                          "Unknown coach"}
                      </h3>
                      <p className="mt-1 text-sm text-default-600">
                        {coach.email}
                      </p>
                    </div>

                    <div className="rounded-full border border-default-200 px-3 py-1 text-sm text-default-700">
                      Contracts: {coach.contract_count ?? 0}
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-default-800">
                        <Wallet className="h-4 w-4" />
                        Current price
                      </div>
                      <p className="mt-2 text-lg font-semibold text-default-900">
                        {formatAdminCurrency(coach.price)}
                      </p>
                    </div>

                    <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-default-800">
                        <Award className="h-4 w-4" />
                        Certifications
                      </div>
                      <p className="mt-2 text-lg font-semibold text-default-900">
                        {coach.certifications.length}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                      Coach description
                    </p>
                    <p className="mt-2 text-sm leading-6 text-default-700">
                      {coach.coach_description ??
                        "No coach description provided."}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                      Certification details
                    </p>
                    <div className="mt-3 space-y-3">
                      {coach.certifications.length === 0 ? (
                        <div className="rounded-[18px] border border-default-200 bg-default-50 px-4 py-3 text-sm text-default-600">
                          No certification records were returned for this coach.
                        </div>
                      ) : (
                        coach.certifications.map((certification, index) => (
                          <div
                            key={`${coach.user_id}-${certification.cert_name}-${index}`}
                            className="rounded-[18px] border border-default-200 bg-default-50 p-4"
                          >
                            <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-default-900">
                                  {certification.cert_name}
                                </p>
                                <p className="text-sm text-default-600">
                                  {certification.provider_name ??
                                    "Provider not listed"}
                                </p>
                              </div>

                              <div className="text-sm text-default-500 md:text-right">
                                <p>
                                  Issued:{" "}
                                  {formatAdminDateTime(
                                    certification.issued_date,
                                  )}
                                </p>
                                <p>
                                  Expires:{" "}
                                  {formatAdminDateTime(
                                    certification.expires_date,
                                  )}
                                </p>
                              </div>
                            </div>

                            {certification.description ? (
                              <p className="mt-3 text-sm leading-6 text-default-700">
                                {certification.description}
                              </p>
                            ) : null}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ActiveCoachesTab;
