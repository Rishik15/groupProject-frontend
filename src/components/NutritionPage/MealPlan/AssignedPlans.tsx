import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Pagination, Spinner } from "@heroui/react";
import PlanCard from "./PlanCard";
import { getMyAssignedMealPlans } from "@/services/nutrition/mealPlan";
import type { AssignedMealPlan } from "@/utils/Interfaces/Nutrition/mealPlan";

const ITEMS_PER_PAGE = 4;

export default function AssignedPlans() {
  const [plans, setPlans] = useState<AssignedMealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyAssignedMealPlans();
      setPlans(data);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const totalPages = Math.ceil(plans.length / ITEMS_PER_PAGE);

  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return plans.slice(start, start + ITEMS_PER_PAGE);
  }, [plans, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
    }

    pages.push(totalPages);

    return pages;
  };

  if (loading) {
    return (
      <Card className="flex h-[420px] items-center justify-center border border-[#E6E6EE] bg-white shadow-sm">
        <Spinner size="sm" />
      </Card>
    );
  }

  if (plans.length === 0) {
    return (
      <Card className="flex h-[420px] items-center justify-center border border-dashed border-[#D8D8E8] bg-[#FAFAFF] text-center shadow-sm">
        <div>
          <p className="text-[16px] font-bold text-black">
            No assigned plans yet
          </p>
          <p className="mt-1 text-[14px] text-[#72728A]">
            Assign a plan from the meal plan library.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {paginatedPlans.map((plan) => (
        <div key={plan.meal_plan_id} className="w-full max-w-3xl">
          <PlanCard
            plan={plan}
            onPlanUpdated={loadPlans}
            onPlanDeleted={loadPlans}
          />
        </div>
      ))}

      {totalPages > 1 && (
        <div className="mt-2 flex w-full justify-center">
          <Pagination size="sm" className="justify-center">
            <Pagination.Content className="gap-1">
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={currentPage === 1}
                  onPress={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="h-8 px-2 text-[12px]"
                >
                  <Pagination.PreviousIcon />
                  <span>Prev</span>
                </Pagination.Previous>
              </Pagination.Item>

              {getPageNumbers().map((page, index) =>
                page === "ellipsis" ? (
                  <Pagination.Item key={`ellipsis-${index}`}>
                    <Pagination.Ellipsis className="h-8 min-w-8 text-[12px]" />
                  </Pagination.Item>
                ) : (
                  <Pagination.Item key={page}>
                    <Pagination.Link
                      isActive={page === currentPage}
                      onPress={() => setCurrentPage(page)}
                      className="h-8 min-w-8 text-[12px]"
                    >
                      {page}
                    </Pagination.Link>
                  </Pagination.Item>
                ),
              )}

              <Pagination.Item>
                <Pagination.Next
                  isDisabled={currentPage === totalPages}
                  onPress={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  className="h-8 px-2 text-[12px]"
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
  );
}
