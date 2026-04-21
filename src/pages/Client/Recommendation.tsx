import { useState, useEffect } from "react";
import RecommendedTitle from "../../components/RecommendedExercises/RecommendedTitle";
import FitSummaryCard from "../../components/RecommendedExercises/FitSummaryCard";
import FilterChips from "../../components/RecommendedExercises/FilterChips";
import FilterModal from "../../components/RecommendedExercises/FilterModal";
import type { Filters } from "../../services/RecommendationExercises/types";
import ExerciseCard from "../../components/RecommendedExercises/ExerciseCard";
import AllExercisesModal from "../../components/RecommendedExercises/AllExercisesModal";
import get_all_plans from "../../services/RecommendationExercises/getAllPlans";
import type { Plan } from "../../services/RecommendationExercises/types";
import NoResultCard from "../../components/RecommendedExercises/NoResultCard";

export default function Recommendation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenWorkouts, setIsOpenWorkouts] = useState(false);
  const [all_plans, set_allPlans] = useState<Plan[]>([]);
  const [plan, setPlan] = useState<Plan>()
  const [submit, setSubmit] = useState(false);


  useEffect(() => {
    const handleBrowseWorkouts = async () => {
      const res = await get_all_plans();
      console.log(res.data.plans);
      set_allPlans(res.data.plans);
    };

    if (isOpenWorkouts) {
      handleBrowseWorkouts();
    }
  }, [isOpenWorkouts]);

  const [filters, setFilters] = useState<Filters>({
    category: "",
    level: "",
    days_per_week: "",
    duration: "",
  });

  return (
    <div className="flex justify-center py-12">
      <div className="min-h-screen">
        <div className="flex flex-row gap-3">
          <RecommendedTitle
            openModalWorkouts={() => setIsOpenWorkouts(true)}
            openModal={() => setIsOpen(true)}
          />
          <FitSummaryCard openModal={() => setIsOpen(true)} filters={filters} />
        </div>
        <div className="mt-8">
          <h1 className="text-[28px] font-bold">Matched plan</h1>
          <p className="text-gray-500">
            Based on your current filters, this is the plan that matches.
          </p>
        </div>

        {plan != null ? (<ExerciseCard submit={submit} setSubmit={setSubmit} plan={plan} />) : (<NoResultCard  openModalWorkouts={() => setIsOpenWorkouts(true)} openModal={() => setIsOpen(true)}/>)}

        <FilterModal
          filters={filters}
          setFilters={setFilters}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setPlan={setPlan}
        />

        <AllExercisesModal
          isOpen={isOpenWorkouts}
          setIsOpen={setIsOpenWorkouts}
          plans={all_plans}
        />
      </div>
    </div>
  );
}
