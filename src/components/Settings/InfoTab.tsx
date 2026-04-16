import { Card, Input, Label } from "@heroui/react";
import type { Dispatch, SetStateAction, ChangeEvent } from "react";

type AvailabilitySlot = {
  day_of_week: string;
  start_time: string;
  end_time: string;
};

type User = {
  first_name?: string;
  last_name?: string;
  email?: string;
  dob?: string;

  weight?: string | number; 
  height?: string | number;
  goal_weight?: string | number;

  price?: string | number;
  coach_description?: string;
  avg_rating?: number | null;
  reviews?: unknown[];
  active_clients?: number;
  availability?: AvailabilitySlot[];
};

type InfoTabProps = {
  form: User | null;
  setForm: Dispatch<SetStateAction<User | null>>;
  edit: boolean;
  role: string;
};

export function InfoTab({ form, setForm, edit, role }: InfoTabProps) {
  if (!form) return null;

  const fullName = `${form.first_name ?? ""} ${form.last_name ?? ""}`.trim();

  const getInputClass = (editable: boolean) =>
    editable
      ? "rounded-md bg-white border border-gray-200"
      : "rounded-md bg-gray-100";

  const updateNumberField =
    (key: keyof User) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) =>
        prev
          ? {
              ...prev,
              [key]: value === "" ? "" : Number(value),
            }
          : prev
      );
    };

  const updateTextField =
    (key: keyof User) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) =>
        prev
          ? {
              ...prev,
              [key]: value,
            }
          : prev
      );
    };

  return (
    <Card className="w-165 rounded-xl border border-[#E8E8EF]">
      <Card.Footer className="flex flex-col items-start gap-4 pt-2 pl-2 pr-2">
        <div className="flex w-full flex-col gap-2">
          <Label>Full Name</Label>
          <Input
            value={fullName}
            readOnly
            className={getInputClass(false)}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Email</Label>
          <Input
            value={form.email ?? ""}
            readOnly
            className={getInputClass(false)}
          />
        </div>

        {role !== "coach" && (
          <>
            <div className="flex w-full flex-col gap-2">
              <Label>Date of Birth</Label>
              <Input
                value={form.dob ?? ""}
                readOnly
                className={getInputClass(false)}
              />
            </div>

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
          </>
        )}

        {role === "coach" && (
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
                  value={
                    form.avg_rating != null ? `${form.avg_rating} ★` : "N/A"
                  }
                  readOnly
                  className={getInputClass(false)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Reviews</Label>
                <Input
                  value={String(form.reviews?.length ?? 0)}
                  readOnly
                  className={getInputClass(false)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Active Clients</Label>
                <Input
                  value={String(form.active_clients ?? 0)}
                  readOnly
                  className={getInputClass(false)}
                />
              </div>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label>Availability</Label>
              <div className="flex w-full flex-col gap-2">
                {form.availability && form.availability.length > 0 ? (
                  form.availability.map((slot, index) => (
                    <div
                      key={`${slot.day_of_week}-${slot.start_time}-${slot.end_time}-${index}`}
                      className="flex items-center justify-between rounded-md bg-gray-100 px-3 py-3 text-sm"
                    >
                      <span className="font-medium text-gray-700">
                        {slot.day_of_week}
                      </span>
                      <span className="text-gray-600">
                        {slot.start_time} - {slot.end_time}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-md bg-gray-100 px-3 py-3 text-sm text-gray-500">
                    No availability set
                  </div>
                )}
              </div>
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label>Coach Description</Label>
              <textarea
                value={form.coach_description ?? ""}
                readOnly={!edit}
                onChange={(e) =>
                  setForm((prev) =>
                    prev
                      ? {
                          ...prev,
                          coach_description: e.target.value,
                        }
                      : prev
                  )
                }
                className={`min-h-32 w-full resize-none rounded-md px-3 py-3 text-sm outline-none ${
                  edit
                    ? "bg-white border border-gray-200"
                    : "bg-gray-100 border border-transparent"
                }`}
              />
            </div>
          </>
        )}
      </Card.Footer>
    </Card>
  );
}