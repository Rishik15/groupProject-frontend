import { Input, Label } from "@heroui/react";
import type { ChangeEvent } from "react";
import type { User } from "../../../services/Setting/User";
import { getInputClass } from "../utils";

type CoachStatsSectionProps = {
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

type StatCardProps = {
  label: string;
  value: string;
  subText?: string;
};

function StatCard({ label, value, subText }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[#E8E8EF] bg-[#FAFAFC] p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-[#72728A]">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-[#0F0F14]">{value}</p>

      {subText && <p className="mt-1 text-xs text-[#72728A]">{subText}</p>}
    </div>
  );
}

const getValidationInputClass = (edit: boolean, error: string) => {
  return [
    getInputClass(edit),
    "outline outline-2 -outline-offset-1",
    error ? "outline-red-400" : "outline-transparent",
  ].join(" ");
};

export default function CoachStatsSection({
  form,
  edit,
  updateNumberField,
  getNumberError,
}: CoachStatsSectionProps) {
  const priceError = edit ? getNumberError("price", form.price) : "";

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-2">
        <Label className="text-sm font-semibold text-[#0F0F14]">Price</Label>

        <Input
          type="number"
          step="0.01"
          min="0"
          value={form.price != null ? String(form.price) : ""}
          readOnly={!edit}
          onChange={updateNumberField("price")}
          aria-invalid={Boolean(priceError)}
          className={getValidationInputClass(edit, priceError)}
        />

        <p className="h-2 text-[11px] leading-3 text-red-500">{priceError}</p>

        {!edit && (
          <p className="text-xs text-[#72728A]">
            Click Edit to update your coaching price.
          </p>
        )}
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Rating"
          value={form.avg_rating != null ? `${form.avg_rating} ★` : "N/A"}
          subText="Average client rating"
        />

        <StatCard
          label="Reviews"
          value={String(form.reviews?.length ?? 0)}
          subText="Total reviews"
        />

        <StatCard
          label="Active Clients"
          value={String(form.active_clients ?? 0)}
          subText="Currently assigned"
        />
      </div>
    </div>
  );
}
