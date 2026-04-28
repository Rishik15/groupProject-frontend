import { Card, Separator } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import MealPlanList from "./MealPlanList";
import MealPlanPagination from "./MealPlanPagination";
import MealPlanSearch from "./MealPlanSearch";
import MealPlanCard from "./MealPlanCard";
import NoSelectedCard from "./NoSelectedCard";
import AssignModal from "./AssignModal";
import { getMealPlanDetail, getMealPlans } from "@/services/nutrition/mealPlan";
import type {
  MealPlanDetail,
  MealPlanSummary,
} from "@/utils/Interfaces/Nutrition/mealPlan";

const ITEMS_PER_PAGE = 4;

const MealPlanLibrary = () => {
  const [mealPlans, setMealPlans] = useState<MealPlanSummary[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<MealPlanSummary | null>(
    null,
  );
  const [selectedPlanDetail, setSelectedPlanDetail] =
    useState<MealPlanDetail | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMealPlans = async () => {
    setLoadingPlans(true);

    try {
      const data = await getMealPlans();
      setMealPlans(data);
    } catch {
      setError("Failed to load meal plans.");
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    loadMealPlans();
  }, []);

  useEffect(() => {
    const loadSelectedPlan = async () => {
      if (!selectedPlan) {
        setSelectedPlanDetail(null);
        return;
      }

      setLoadingDetail(true);
      setSelectedPlanDetail(null);

      try {
        const data = await getMealPlanDetail(selectedPlan.meal_plan_id);
        setSelectedPlanDetail(data);
      } catch {
        setError("Failed to load selected plan.");
      } finally {
        setLoadingDetail(false);
      }
    };

    loadSelectedPlan();
  }, [selectedPlan]);

  const filteredMealPlans = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return mealPlans;
    }

    return mealPlans.filter((plan) =>
      plan.plan_name.toLowerCase().includes(query),
    );
  }, [mealPlans, search]);

  const totalPages = Math.ceil(filteredMealPlans.length / ITEMS_PER_PAGE);

  const paginatedMealPlans = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMealPlans.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMealPlans, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="flex w-full flex-col gap-4 xl:flex-row">
      <Card className="flex h-[560px] w-full shrink-0 flex-col overflow-hidden border border-[#E6E6EE] bg-white p-0 shadow-sm xl:w-[370px]">
        <Card.Header className="shrink-0 flex-col items-start gap-1 px-4 py-3">
          <Card.Title className="text-[18px] font-bold text-black">
            Meal Plan Library
          </Card.Title>

          <Card.Description className="text-[12px] text-[#72728A]">
            Search and preview weekly plans.
          </Card.Description>
        </Card.Header>

        <Separator />

        <Card.Content className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-4 py-3">
          {error && (
            <div className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
              {error}
            </div>
          )}

          <div className="shrink-0">
            <MealPlanSearch search={search} setSearch={setSearch} />
          </div>

          {loadingPlans ? (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-[14px] text-[#72728A]">Loading plans...</p>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-2 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <MealPlanList
                  selectedPlanId={selectedPlan?.meal_plan_id ?? null}
                  onSelectPlan={setSelectedPlan}
                  mealPlans={paginatedMealPlans}
                />
              </div>

              <div className="shrink-0 border-t border-[#EFEFF5] pt-2">
                <MealPlanPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </>
          )}
        </Card.Content>
      </Card>

      <div className="min-w-0 flex-1">
        {loadingDetail ? (
          <Card className="flex h-[560px] w-full items-center justify-center border border-[#E6E6EE] bg-white shadow-sm">
            <p className="text-[14px] text-[#72728A]">Loading plan...</p>
          </Card>
        ) : selectedPlanDetail ? (
          <MealPlanCard
            mealPlan={selectedPlanDetail}
            onAssign={() => setShowAssignModal(true)}
          />
        ) : (
          <NoSelectedCard />
        )}
      </div>

      {showAssignModal && selectedPlan && (
        <AssignModal
          mealPlanId={selectedPlan.meal_plan_id}
          planName={selectedPlan.plan_name}
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => {
            setAssignSuccess(true);
            setTimeout(() => setAssignSuccess(false), 2500);
          }}
        />
      )}

      {assignSuccess && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[14px] font-medium text-green-600 shadow-lg">
          Plan assigned successfully.
        </div>
      )}
    </div>
  );
};

export default MealPlanLibrary;
