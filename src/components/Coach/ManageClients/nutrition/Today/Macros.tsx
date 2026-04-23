import { Meter, Label } from "@heroui/react";

interface MacroValue {
  current: number;
}

interface MacrosProps {
  protein: MacroValue;
  carbs: MacroValue;
  fats: MacroValue;
}

const MAX = {
  protein: 150,
  carbs: 200,
  fats: 65,
};

const Macros = ({ protein, carbs, fats }: MacrosProps) => {
  return (
    <div className="rounded-2xl border border-neutral-300 bg-white p-6 w-full">
      <div className="text-[15px] font-semibold text-[#0F0F14]">
        Macronutrients
      </div>

      <div className="mt-6 space-y-4">
        <Meter value={protein.current} maxValue={MAX.protein} size="sm">
          <div className="mb-1 flex items-center justify-between">
            <Label className="text-[11.25px] text-[#72728A]">Protein</Label>
            <span className="text-[11.25px] font-medium text-[#0F0F14]">
              {protein.current}g
            </span>
          </div>
          <Meter.Track className="rounded-full bg-[#E9E9F4]">
            <Meter.Fill className="rounded-full bg-[#5E5EF4]" />
          </Meter.Track>
        </Meter>

        <Meter value={carbs.current} maxValue={MAX.carbs} size="sm">
          <div className="mb-1 flex items-center justify-between">
            <Label className="text-[11.25px] text-[#72728A]">Carbs</Label>
            <span className="text-[11.25px] font-medium text-[#0F0F14]">
              {carbs.current}g
            </span>
          </div>
          <Meter.Track className="rounded-full bg-[#E9E9F4]">
            <Meter.Fill className="rounded-full bg-[#22C55E]" />
          </Meter.Track>
        </Meter>

        <Meter value={fats.current} maxValue={MAX.fats} size="sm">
          <div className="mb-1 flex items-center justify-between">
            <Label className="text-[11.25px] text-[#72728A]">Fat</Label>
            <span className="text-[11.25px] font-medium text-[#0F0F14]">
              {fats.current}g
            </span>
          </div>
          <Meter.Track className="rounded-full bg-[#E9E9F4]">
            <Meter.Fill className="rounded-full bg-[#F59E0B]" />
          </Meter.Track>
        </Meter>
      </div>
    </div>
  );
};

export default Macros;
