import { Input, Label } from "@heroui/react";
import type { ChangeEvent } from "react";
import type { User } from "../../../services/Setting/User";
import { getInputClass } from "../utils";

type ClientMetricsSectionProps = {
  form: User;
  edit: boolean;
  updateNumberField: (
    key: keyof User,
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  getNumberError: (
    key: keyof User,
    value: string | number | null | undefined,
  ) => string;
};

const getValidationInputClass = (edit: boolean, error: string) => {
  return [
    getInputClass(edit),
    "outline outline-2 -outline-offset-1",
    error ? "outline-red-400" : "outline-transparent",
  ].join(" ");
};

export default function ClientMetricsSection({
  form,
  edit,
  updateNumberField,
  getNumberError,
}: ClientMetricsSectionProps) {
  const weightError = edit ? getNumberError("weight", form.weight) : "";
  const goalWeightError = edit
    ? getNumberError("goal_weight", form.goal_weight)
    : "";
  const heightError = edit ? getNumberError("height", form.height) : "";

  return (
    <div className="grid w-full grid-cols-3 gap-4">
      <div className="flex flex-col gap-2">
        <Label>Weight</Label>
        <Input
          type="number"
          value={form.weight != null ? String(form.weight) : ""}
          readOnly={!edit}
          onChange={updateNumberField("weight")}
          aria-invalid={Boolean(weightError)}
          className={getValidationInputClass(edit, weightError)}
        />

        <p className="h-2 text-[11px] leading-3 text-red-500">
          {weightError}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Goal Weight</Label>
        <Input
          type="number"
          value={form.goal_weight != null ? String(form.goal_weight) : ""}
          readOnly={!edit}
          onChange={updateNumberField("goal_weight")}
          aria-invalid={Boolean(goalWeightError)}
          className={getValidationInputClass(edit, goalWeightError)}
        />

        <p className="h-2 text-[11px] leading-3 text-red-500">
          {goalWeightError}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Height</Label>
        <Input
          type="number"
          value={form.height != null ? String(form.height) : ""}
          readOnly={!edit}
          onChange={updateNumberField("height")}
          aria-invalid={Boolean(heightError)}
          className={getValidationInputClass(edit, heightError)}
        />

        <p className="h-2 text-[11px] leading-3 text-red-500">
          {heightError}
        </p>
      </div>
    </div>
  );
}