import { useEffect, useState } from "react";
import type {
  TodayMeal,
  UserMealPlan,
} from "../../../services/meallogging/logMealService";
import {
  getMyMealPlans,
  getTodaysMeals,
  logMealFromPlan,
} from "../../../services/meallogging/logMealService";
import MealPlanSelector from "./MealPlanSelector";
import TodaysMeals from "./TodaysMeals";
import MealPlanLogForm from "./MealPlanLogForm";
import type { CalendarDate, Time } from "@internationalized/date";

interface MealPlanTabProps {
  onSuccess?: () => void;
}

type Step = "select" | "log";

const pad = (value: number) => String(value).padStart(2, "0");

const buildEatenAt = (date: CalendarDate | null, time: Time | null) => {
  if (!date || !time) return "";

  return `${date.year}-${pad(date.month)}-${pad(date.day)}T${pad(
    time.hour,
  )}:${pad(time.minute)}:00`;
};

const revokeBlobUrl = (url: string) => {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
};

export default function MealPlanTab({ onSuccess }: MealPlanTabProps) {
  const [plans, setPlans] = useState<UserMealPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [todaysMeals, setTodaysMeals] = useState<TodayMeal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(false);

  const [step, setStep] = useState<Step>("select");
  const [selectedMeal, setSelectedMeal] = useState<TodayMeal | null>(null);

  const [eatenOn, setEatenOn] = useState<CalendarDate | null>(null);
  const [eatenTime, setEatenTime] = useState<Time | null>(null);
  const [servings, setServings] = useState("1");
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await getMyMealPlans();
        setPlans(data);
      } catch {
        setError("Failed to load meal plans.");
      } finally {
        setPlansLoading(false);
      }
    };

    loadPlans();
  }, []);

  useEffect(() => {
    if (!selectedPlanId) {
      setTodaysMeals([]);
      return;
    }

    const loadMeals = async () => {
      setMealsLoading(true);

      try {
        const data = await getTodaysMeals(selectedPlanId);
        setTodaysMeals(data);
      } catch {
        setError("Failed to load today's meals.");
      } finally {
        setMealsLoading(false);
      }
    };

    loadMeals();
  }, [selectedPlanId]);

  const handleSelectMeal = (meal: TodayMeal) => {
    setSelectedMeal(meal);
    setServings(String(meal.servings ?? 1));
    setNotes("");
    setPhotoFile(null);
    setPhotoPreviewUrl("");
    setError(null);
    setStep("log");
  };

  const handleBack = () => {
    revokeBlobUrl(photoPreviewUrl);
    setStep("select");
    setSelectedMeal(null);
    setError(null);
  };

  const handlePhotoChange = (file: File | null) => {
    revokeBlobUrl(photoPreviewUrl);
    setPhotoFile(file);
    setPhotoPreviewUrl(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async () => {
    if (!selectedMeal) return;

    const parsedServings = Number(servings);
    const eaten_at = buildEatenAt(eatenOn, eatenTime);

    if (!eaten_at) {
      setError("Date and time are required.");
      return;
    }

    if (!Number.isFinite(parsedServings) || parsedServings <= 0) {
      setError("Servings must be greater than 0.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await logMealFromPlan({
        meal_id: selectedMeal.meal_id,
        servings: parsedServings,
        eaten_at,
        notes,
        photoFile,
      });

      revokeBlobUrl(photoPreviewUrl);
      onSuccess?.();
    } catch {
      setError("Failed to log meal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-[13.125px] text-red-600">
          {error}
        </p>
      )}

      {step === "select" && (
        <>
          <MealPlanSelector
            plans={plans}
            selectedPlanId={selectedPlanId}
            onChange={setSelectedPlanId}
            isLoading={plansLoading}
          />

          {selectedPlanId && (
            <TodaysMeals
              meals={todaysMeals}
              isLoading={mealsLoading}
              onLogMeal={handleSelectMeal}
            />
          )}
        </>
      )}

      {step === "log" && selectedMeal && (
        <MealPlanLogForm
          meal={selectedMeal}
          eatenOn={eatenOn}
          eatenTime={eatenTime}
          servings={servings}
          notes={notes}
          photoFile={photoFile}
          photoPreviewUrl={photoPreviewUrl}
          isSubmitting={isSubmitting}
          onEatenOnChange={setEatenOn}
          onEatenTimeChange={setEatenTime}
          onServingsChange={setServings}
          onNotesChange={setNotes}
          onPhotoChange={handlePhotoChange}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
