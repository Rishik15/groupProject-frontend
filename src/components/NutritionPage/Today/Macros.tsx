import { useEffect, useState } from "react";
import { Meter, Label } from "@heroui/react";
import { getNutritionGoals } from "../../../services/nutrition/nutritionGoals";

interface MacroValue {
  current: number;
  goal: number | null;
}

interface MacrosProps {
  protein: MacroValue;
  carbs: MacroValue;
  fats: MacroValue;
}

interface MacroRowProps {
  label: string;
  value: MacroValue;
  fallbackMax: number;
  fillClassName: string;
}

const MacroRow = ({
  label,
  value,
  fallbackMax,
  fillClassName,
}: MacroRowProps) => {
  const goalValue = value.goal;
  const hasGoal = typeof goalValue === "number" && goalValue > 0;

  const meterMaxValue = hasGoal ? goalValue : fallbackMax;
  const meterValue = Math.min(value.current, meterMaxValue);

  return (
    <Meter
      aria-label={label}
      className="w-full"
      value={meterValue}
      maxValue={meterMaxValue}
      size="sm"
    >
      <div className="mb-1 flex items-center justify-between">
        <Label className="text-[11.25px] text-[#72728A]">{label}</Label>

        <span className="text-[11.25px] font-medium text-[#0F0F14]">
          {hasGoal ? `${value.current}g / ${goalValue}g` : `${value.current}g`}
        </span>
      </div>

      <Meter.Track className="rounded-full bg-[#E9E9F4]">
        <Meter.Fill className={`rounded-full ${fillClassName}`} />
      </Meter.Track>
    </Meter>
  );
};

const Macros = ({ protein, carbs, fats }: MacrosProps) => {
  const [macroGoals, setMacroGoals] = useState({
    protein: protein.goal,
    carbs: carbs.goal,
    fats: fats.goal,
  });

  useEffect(() => {
    setMacroGoals({
      protein: protein.goal,
      carbs: carbs.goal,
      fats: fats.goal,
    });
  }, [protein.goal, carbs.goal, fats.goal]);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const goals = await getNutritionGoals();

        if (goals) {
          setMacroGoals({
            protein: goals.protein_target,
            carbs: goals.carbs_target,
            fats: goals.fat_target,
          });
        }
      } catch (err) {
        console.error("Failed to load nutrition goals:", err);
      }
    };

    loadGoals();

    window.addEventListener("nutritionGoalsUpdated", loadGoals);

    return () => {
      window.removeEventListener("nutritionGoalsUpdated", loadGoals);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-300 bg-white p-6 w-full">
      <div className="text-[15px] font-semibold text-[#0F0F14]">
        Macronutrients
      </div>

      <div className="mt-6 space-y-4">
        <MacroRow
          label="Protein"
          value={{
            current: protein.current,
            goal: macroGoals.protein,
          }}
          fallbackMax={150}
          fillClassName="bg-[#5E5EF4]"
        />

        <MacroRow
          label="Carbs"
          value={{
            current: carbs.current,
            goal: macroGoals.carbs,
          }}
          fallbackMax={200}
          fillClassName="bg-[#22C55E]"
        />

        <MacroRow
          label="Fat"
          value={{
            current: fats.current,
            goal: macroGoals.fats,
          }}
          fallbackMax={65}
          fillClassName="bg-[#F59E0B]"
        />
      </div>
    </div>
  );
};

export default Macros;
