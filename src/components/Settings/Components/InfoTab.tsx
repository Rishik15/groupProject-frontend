import { Card } from "@heroui/react";
import type { Dispatch, SetStateAction, ChangeEvent } from "react";
import type { User, AvailabilitySlot } from "../../../services/Setting/User";

import ProfileSection from "../Sections/ProfileSection";
import ClientMetricsSection from "../Sections/ClientMetricsSection";
import CoachStatsSection from "../Sections/CoachStatsSection";
import CoachAvailabilitySection from "../Sections/CoachAvailabilitySection";
import CoachCertificationsSection from "../Sections/CoachCertificationsSection";
import { CoachDescriptionBlock } from "../Sections/CoachDescriptionBlock";

type InfoTabProps = {
  form: User | null;
  setForm: Dispatch<SetStateAction<User | null>>;
  edit: boolean;
  role: string;
};

export function InfoTab({ form, setForm, edit, role }: InfoTabProps) {
  if (!form) return null;

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
          ) ?? [],
        }
        : prev
    );

    console.log(form?.availability?.[index]);

  };

  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  const addAvailability = () => {
    if (!form) return;

    const existingDays = form.availability?.map(a => a.day_of_week) ?? [];

    const nextDay = days.find(day => !existingDays.includes(day));

    if (!nextDay) return;

    setForm((prev) =>
      prev
        ? {
          ...prev,
          availability: [
            ...(prev.availability ?? []),
            {
              day_of_week: nextDay,
              start_time: "09:00:00",
              end_time: "17:00:00",
            },
          ],
        }
        : prev
    );
  };

  const removeAvailability = (index: number) => {
    setForm((prev) =>
      prev
        ? {
          ...prev,
          availability:
            prev.availability?.filter((_, i) => i !== index) ?? [],
        }
        : prev
    );
  };

  return (
    <Card className="w-165 rounded-xl border border-[#E8E8EF]">
      <Card.Footer className="flex flex-col items-start gap-4 pt-2 pl-2 pr-2">
        <ProfileSection form={form} role={role} />

        {role !== "coach" && (
          <ClientMetricsSection
            form={form}
            edit={edit}
            updateNumberField={updateNumberField}
          />
        )}

        {role === "coach" && (
          <>
            <CoachStatsSection
              form={form}
              edit={edit}
              updateNumberField={updateNumberField}
            />

            <CoachAvailabilitySection
              availability={form.availability}
              edit={edit}
              updateAvailabilityField={updateAvailabilityField}
              addAvailability={addAvailability}
              removeAvailability={removeAvailability}
            />

            <CoachCertificationsSection form={form} edit={edit} />

            <CoachDescriptionBlock
              form={form}
              edit={edit}
              updateField={updateField}
            />
          </>
        )}
      </Card.Footer>
    </Card>
  );
}