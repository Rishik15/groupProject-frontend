import { Card } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import MealPlanList from "./MealPlanList";
import MealPlanPagination from "./MealPlanPagination";
import MealPlanSearch from "./MealPlanSearch";
import type { MealPlan as MealPlanType, MealPlanDetail } from "./type";
import MealPlanCard from "./MealPlanCard";
import NoSelectedCard from "./NoSelectedCard";
import AssignModal from "./AssignModal";

const ITEMS_PER_PAGE = 5;

const MealPlanLibrary = () => {
  const [mealPlans, setMealPlans] = useState<MealPlanType[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<MealPlanType | null>(null);
  const [selectedPlanDetail, setPlanDetail] = useState<MealPlanDetail | null>(
    null,
  );
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);

  useEffect(() => {
    const getMeals = async () => {
      const res = await fetch("http://localhost:8080/nutrition/meal-plans", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setMealPlans(Array.isArray(data) ? data : (data.meal_plans ?? []));
    };

    getMeals();
  }, []);

  useEffect(() => {
    if (!selectedPlan) {
      setPlanDetail(null);
      return;
    }

    const getSelectedMealDetail = async () => {
      setPlanDetail(null);

      const res = await fetch(
        "http://localhost:8080/nutrition/meal-plans/detail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            meal_plan_id: selectedPlan.meal_plan_id,
          }),
        },
      );

      const data = await res.json();
      setPlanDetail(data);
    };

    getSelectedMealDetail();
  }, [selectedPlan]);

  const filteredMealPlans = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return mealPlans;

    return mealPlans.filter((plan) => plan.plan_name.toLowerCase().includes(q));
  }, [mealPlans, search]);

  const totalPages = Math.ceil(filteredMealPlans.length / ITEMS_PER_PAGE);

  const paginatedMealPlans = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return filteredMealPlans.slice(start, end);
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
    <div className="flex flex-row gap-2">
      <Card className="w-170 border p-4 h-fit">
        <div className="mb-3">
          <Card.Header className="p-0 text-2xl font-bold">
            Meal Plan Library
          </Card.Header>

          <Card.Description>
            Loaded from your meal plan library
          </Card.Description>
        </div>

        <MealPlanSearch search={search} setSearch={setSearch} />

        <MealPlanList
          onSelectPlan={setSelectedPlan}
          mealPlans={paginatedMealPlans}
        />

        <MealPlanPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </Card>

      {selectedPlanDetail === null ? (
        <NoSelectedCard />
      ) : (
        <MealPlanCard
          mealPlan={selectedPlanDetail}
          onAssign={() => setShowAssignModal(true)}
        />
      )}

      {showAssignModal && selectedPlan && (
        <AssignModal
          mealPlanId={selectedPlan.meal_plan_id}
          planName={selectedPlan.plan_name}
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => {
            setAssignSuccess(true);
            setTimeout(() => setAssignSuccess(false), 3000);
          }}
        />
      )}

      {assignSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3 mb-2">
          Plan assigned successfully!
        </div>
      )}
    </div>
  );
};

export default MealPlanLibrary;
