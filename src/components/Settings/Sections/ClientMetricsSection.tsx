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
};

export default function ClientMetricsSection({
  form,
  edit,
  updateNumberField,
}: ClientMetricsSectionProps) {
  return (
    <div className="grid w-full grid-cols-3 gap-4">
      <div className="flex flex-col gap-2">
        <Label>Weight</Label>
        <Input
          type="number"
          value={form.weight != null ? String(form.weight) : ""}
          readOnly={!edit}
          onChange={updateNumberField("weight")}
          className={getInputClass(edit)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Goal Weight</Label>
        <Input
          type="number"
          value={form.goal_weight != null ? String(form.goal_weight) : ""}
          readOnly={!edit}
          onChange={updateNumberField("goal_weight")}
          className={getInputClass(edit)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Height</Label>
        <Input
          type="number"
          value={form.height != null ? String(form.height) : ""}
          readOnly={!edit}
          onChange={updateNumberField("height")}
          className={getInputClass(edit)}
        />
      </div>
    </div>
  );
}
