import { Card } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import MealPlanList from "./MealPlanList";
import MealPlanPagination from "./MealPlanPagination";
import MealPlanSearch from "./MealPlanSearch";
import type { MealPlan } from "./type";
import MealPlanCard from "./MealPlanCard";

const ITEMS_PER_PAGE = 5;

const MealPlan = () => {
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const getMeals = async () => {
            const res = await fetch("http://localhost:8080/nutrition/meal-plans", {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();
            setMealPlans(Array.isArray(data) ? data : data.meal_plans ?? []);
        };

        getMeals();
    }, []);

    const filteredMealPlans = useMemo(() => {
        const q = search.trim().toLowerCase();

        if (!q) return mealPlans;

        return mealPlans.filter((plan) =>
            plan.plan_name.toLowerCase().includes(q)
        );
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
            <Card className="w-170 border p-4">
                <div className="mb-3">
                    <Card.Header className="p-0 text-2xl font-bold">
                        Meal Plan Library
                    </Card.Header>
                    <Card.Description>
                        Loaded from your meal plan library
                    </Card.Description>
                </div>

                <MealPlanSearch search={search} setSearch={setSearch} />

                <MealPlanList mealPlans={paginatedMealPlans} />

                <MealPlanPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />

            </Card>
            <MealPlanCard/>
        </div>
    );
};

export default MealPlan;