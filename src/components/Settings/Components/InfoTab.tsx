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

type SettingsNumberField = "height" | "weight" | "goal_weight" | "price";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const NUMBER_LIMITS: Record<
  SettingsNumberField,
  {
    min: number;
    max: number;
    decimals: number;
    shortLabel: string;
  }
> = {
  height: {
    min: 24,
    max: 96,
    decimals: 1,
    shortLabel: "24-96 in",
  },
  weight: {
    min: 50,
    max: 700,
    decimals: 1,
    shortLabel: "50-700 lb",
  },
  goal_weight: {
    min: 50,
    max: 700,
    decimals: 1,
    shortLabel: "50-700 lb",
  },
  price: {
    min: 1,
    max: 1000,
    decimals: 2,
    shortLabel: "$1-$1000",
  },
};

const isSettingsNumberField = (key: keyof User): key is SettingsNumberField => {
  return key in NUMBER_LIMITS;
};

const isValidNumberInput = (value: string, decimals: number) => {
  if (value === "") return true;

  if (decimals === 0) {
    return /^\d*$/.test(value);
  }

  return new RegExp(`^\\d{0,4}(\\.\\d{0,${decimals}})?$`).test(value);
};

export const getSettingsNumberError = (
  key: keyof User,
  value: string | number | null | undefined,
) => {
  if (!isSettingsNumberField(key)) {
    return "";
  }

  const rules = NUMBER_LIMITS[key];
  const stringValue =
    value === null || value === undefined ? "" : String(value);

  if (stringValue.trim() === "") {
    return "";
  }

  const numericValue = Number(stringValue);

  if (!Number.isFinite(numericValue)) {
    return "Invalid";
  }

  if (numericValue < rules.min || numericValue > rules.max) {
    return rules.shortLabel;
  }

  return "";
};

export const hasSettingsNumberErrors = (form: User | null) => {
  if (!form) {
    return false;
  }

  return (
    Boolean(getSettingsNumberError("height", form.height)) ||
    Boolean(getSettingsNumberError("weight", form.weight)) ||
    Boolean(getSettingsNumberError("goal_weight", form.goal_weight)) ||
    Boolean(getSettingsNumberError("price", form.price))
  );
};

export function InfoTab({ form, setForm, edit, role }: InfoTabProps) {
  if (!form) return null;

  const updateField = (key: keyof User, value: string | number) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateNumberField =
    (key: keyof User) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (isSettingsNumberField(key)) {
        const rules = NUMBER_LIMITS[key];

        if (!isValidNumberInput(value, rules.decimals)) {
          return;
        }

        updateField(key, value === "" ? "" : Number(value));
        return;
      }

      updateField(key, value === "" ? "" : Number(value));
    };

  const updateAvailabilityField = (
    index: number,
    key: keyof AvailabilitySlot,
    value: string,
  ) => {
    setForm((prev) => {
      if (!prev) return prev;

      const currentAvailability = prev.availability ?? [];

      if (key === "day_of_week") {
        if (!DAYS.includes(value)) {
          return prev;
        }

        const duplicateDay = currentAvailability.some(
          (slot, i) => i !== index && slot.day_of_week === value,
        );

        if (duplicateDay) {
          return prev;
        }
      }

      return {
        ...prev,
        availability: currentAvailability.map((slot, i) =>
          i === index ? { ...slot, [key]: value } : slot,
        ),
      };
    });
  };

  const addAvailability = () => {
    const existingDays = form.availability?.map((a) => a.day_of_week) ?? [];
    const nextDay = DAYS.find((day) => !existingDays.includes(day));

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
              getNumberError={getSettingsNumberError}
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
                getNumberError={getSettingsNumberError}
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
