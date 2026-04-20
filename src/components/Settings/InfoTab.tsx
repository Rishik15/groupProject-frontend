import { Card, Input, Label, TimeField } from "@heroui/react";
import type { Dispatch, SetStateAction, ChangeEvent } from "react";
import { parseTime, type Time } from "@internationalized/date";
import type { User, AvailabilitySlot } from "../../services/Setting/User";
type InfoTabProps = {
  form: User | null;
  setForm: Dispatch<SetStateAction<User | null>>;
  edit: boolean;
  role: string;
};
const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export function InfoTab({ form, setForm, edit, role }: InfoTabProps) {
  if (!form) return null;

  const fullName = `${form.first_name ?? ""} ${form.last_name ?? ""}`.trim();

  const editableClass = "rounded-md border border-gray-200 bg-white";
  const readonlyClass = "rounded-md bg-gray-100";
  const timeBoxClass = edit
    ? "flex min-h-10 items-center rounded-md border border-gray-200 bg-white px-3"
    : "flex min-h-10 items-center rounded-md bg-gray-100 px-3";

  const getInputClass = (editable: boolean) =>
    editable ? editableClass : readonlyClass;

  const updateField = (key: keyof User, value: string | number) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateNumberField =
    (key: keyof User) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      updateField(key, value === "" ? "" : Number(value));
    };

  const updateAvailabilityField = (
    index: number,
    key: keyof AvailabilitySlot,
    value: string
  ) => {
    setForm((prev) =>
      prev
        ? {
          ...prev,
          availability: prev.availability?.map((slot, i) =>
            i === index ? { ...slot, [key]: value } : slot
          ),
        }
        : prev
    );
  };

  const parseBackendTime = (value?: string) => {
    if (!value) return null;

    const parts = value.split(":");
    const hour = parts[0]?.padStart(2, "0");
    const minute = parts[1];

    if (!hour || !minute) return null;

    return parseTime(`${hour}:${minute}`);
  };

  const formatTime = (value: Time) => {
    const hour = String(value.hour).padStart(2, "0");
    const minute = String(value.minute).padStart(2, "0");
    return `${hour}:${minute}:00`;
  };

  return (
    <Card className="w-165 rounded-xl border border-[#E8E8EF]">
      <Card.Footer className="flex flex-col items-start gap-4 pt-2 pl-2 pr-2">
        <div className="flex w-full flex-col gap-2">
          <Label>Full Name</Label>
          <Input value={fullName} readOnly className={readonlyClass} />
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>Email</Label>
          <Input value={form.email ?? ""} readOnly className={readonlyClass} />
        </div>

        {role !== "coach" && (
          <>
            <div className="flex w-full flex-col gap-2">
              <Label>Date of Birth</Label>
              <Input
                value={form?.dob ? formatDate(form.dob) : ""}
                readOnly
                className={readonlyClass}
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

            <div className="flex w-full flex-col gap-2">
              <Label>Availability</Label>

              {form.availability && form.availability.length > 0 ? (
                <div className="flex w-full flex-col gap-3">
                  {form.availability.map((slot, index) => (
                    <div
                      key={`${slot.day_of_week}-${index}`}
                      className="grid w-full grid-cols-3 gap-3 rounded-md border border-gray-200 p-3"
                    >
                      <div className="flex flex-col gap-2">
                        <Label>Day</Label>
                        <Input
                          value={slot.day_of_week}
                          readOnly
                          className={readonlyClass}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>Start Time</Label>
                        <div className={timeBoxClass}>
                          <TimeField
                            value={parseBackendTime(slot.start_time)}
                            isReadOnly={!edit}
                            onChange={(value) => {
                              if (value) {
                                updateAvailabilityField(
                                  index,
                                  "start_time",
                                  formatTime(value)
                                );
                              }
                            }}
                          >
                            <TimeField.Input className="w-full outline-none">
                              {(segment) => (
                                <TimeField.Segment segment={segment} />
                              )}
                            </TimeField.Input>
                          </TimeField>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label>End Time</Label>
                        <div className={timeBoxClass}>
                          <TimeField
                            value={parseBackendTime(slot.end_time)}
                            isReadOnly={!edit}
                            onChange={(value) => {
                              if (value) {
                                updateAvailabilityField(
                                  index,
                                  "end_time",
                                  formatTime(value)
                                );
                              }
                            }}
                          >
                            <TimeField.Input className="w-full outline-none">
                              {(segment) => (
                                <TimeField.Segment segment={segment} />
                              )}
                            </TimeField.Input>
                          </TimeField>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md bg-gray-100 px-3 py-3 text-sm text-gray-500">
                  No availability set
                </div>
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label>Coach Description</Label>
              <textarea
                value={form.coach_description ?? ""}
                readOnly={!edit}
                onChange={(e) =>
                  updateField("coach_description", e.target.value)
                }
                className={`min-h-32 w-full resize-none rounded-md px-3 py-3 text-sm outline-none ${edit
                  ? "border border-gray-200 bg-white"
                  : "border border-transparent bg-gray-100"
                  }`}
              />
            </div>
          </>
        )}
      </Card.Footer>
    </Card>
  );
}