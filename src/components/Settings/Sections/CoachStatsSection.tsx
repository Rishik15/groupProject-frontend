import { Input, Label } from "@heroui/react";
import type { ChangeEvent } from "react";
import type { User } from "../../../services/Setting/User";
import { getInputClass, readonlyClass } from "../utils";

type CoachStatsSectionProps = {
  form: User;
  edit: boolean;
  updateNumberField: (
    key: keyof User,
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function CoachStatsSection({
  form,
  edit,
  updateNumberField,
}: CoachStatsSectionProps) {
  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <Label>Price</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={form.price != null ? String(form.price) : ""}
          readOnly={!edit}
          onChange={updateNumberField("price")}
          className={getInputClass(edit)}
        />
      </div>

      <div className="grid w-full grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Rating</Label>
          <Input
            value={form.avg_rating != null ? `${form.avg_rating} ★` : "N/A"}
            readOnly
            className={readonlyClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Reviews</Label>
          <Input
            value={String(form.reviews?.length ?? 0)}
            readOnly
            className={readonlyClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Active Clients</Label>
          <Input
            value={String(form.active_clients ?? 0)}
            readOnly
            className={readonlyClass}
          />
        </div>
      </div>
    </>
  );
}
