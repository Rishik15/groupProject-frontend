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
    value: string,
  ) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            availability:
              prev.availability?.map((slot, i) =>
                i === index ? { ...slot, [key]: value } : slot,
              ) ?? [],
          }
        : prev,
    );

    console.log(form?.availability?.[index]);
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const addAvailability = () => {
    if (!form) return;

    const existingDays = form.availability?.map((a) => a.day_of_week) ?? [];
    const nextDay = days.find((day) => !existingDays.includes(day));

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
        : prev,
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
        : prev,
    );
  };

  return (
    <Card className="w-full max-w-3xl rounded-2xl border border-[#E8E8EF] bg-white shadow-sm">
      <Card.Content className="flex flex-col gap-6 px-6 py-6">
        <ProfileSection form={form} role={role} />

        {role !== "coach" && (
          <section className="flex flex-col gap-3">
            <div>
              <h3 className="text-sm font-semibold text-[#0F0F14]">
                Body Metrics
              </h3>
              <p className="mt-1 text-xs text-[#72728A]">
                These values help personalize your fitness experience.
              </p>
            </div>

            <ClientMetricsSection
              form={form}
              edit={edit}
              updateNumberField={updateNumberField}
            />
          </section>
        )}

        {role === "coach" && (
          <>
            <section className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[#0F0F14]">
                  Coach Overview
                </h3>
                <p className="mt-1 text-xs text-[#72728A]">
                  Your pricing, rating, reviews, and active client count.
                </p>
              </div>

              <CoachStatsSection
                form={form}
                edit={edit}
                updateNumberField={updateNumberField}
              />
            </section>

            <section className="flex flex-col gap-3">
              <CoachAvailabilitySection
                availability={form.availability}
                edit={edit}
                updateAvailabilityField={updateAvailabilityField}
                addAvailability={addAvailability}
                removeAvailability={removeAvailability}
              />
            </section>

            <section className="flex flex-col gap-3">
              <CoachCertificationsSection
                form={form}
                edit={edit}
                setForm={setForm}
              />
            </section>

            <section className="flex flex-col gap-3">
              <CoachDescriptionBlock
                form={form}
                edit={edit}
                updateField={updateField}
              />
            </section>
          </>
        )}
      </Card.Content>
    </Card>
  );
}
