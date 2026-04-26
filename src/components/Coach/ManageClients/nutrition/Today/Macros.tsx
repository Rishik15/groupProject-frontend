import { Meter, Label } from "@heroui/react";

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
  const hasGoal = typeof value.goal === "number" && value.goal > 0;

  const meterMaxValue = hasGoal ? value.goal! : fallbackMax;
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
          {hasGoal ? `${value.current}g / ${value.goal}g` : `${value.current}g`}
        </span>
      </div>

      <Meter.Track className="rounded-full bg-[#E9E9F4]">
        <Meter.Fill className={`rounded-full ${fillClassName}`} />
      </Meter.Track>
    </Meter>
  );
};

const Macros = ({ protein, carbs, fats }: MacrosProps) => {
  return (
    <div className="w-full rounded-2xl border border-neutral-300 bg-white p-6">
      <div className="text-[15px] font-semibold text-[#0F0F14]">
        Macronutrients
      </div>

      <div className="mt-6 space-y-4">
        <MacroRow
          label="Protein"
          value={protein}
          fallbackMax={150}
          fillClassName="bg-[#5E5EF4]"
        />

        <MacroRow
          label="Carbs"
          value={carbs}
          fallbackMax={200}
          fillClassName="bg-[#22C55E]"
        />

        <MacroRow
          label="Fat"
          value={fats}
          fallbackMax={65}
          fillClassName="bg-[#F59E0B]"
        />
      </div>
    </div>
  );
};

export default Macros;