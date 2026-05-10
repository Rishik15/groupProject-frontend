import { Input } from "@heroui/react";
import { DatePicker, DateField, Calendar, FieldError } from "@heroui/react";

import { getLocalTimeZone, today, parseDate } from "@internationalized/date";

import type { DateValue } from "@internationalized/date";
import type { ChangeEvent } from "react";

import type {
  ClientFitnessLevel,
  ClientInfoValues,
} from "../../../utils/Interfaces/OnboardingSurvey/client";

import { clientFitnessOptions } from "../../../utils/OnboardingSurvey/clientConfig";

interface ClientInfoStepProps {
  values: ClientInfoValues;
  fitnessLevel: ClientFitnessLevel | "";
  onFieldChange: (name: keyof ClientInfoValues, value: string) => void;
  onFitnessLevelChange: (value: ClientFitnessLevel) => void;
}

type NumberFieldName = "height" | "weight" | "goalWeight";

const NUMBER_LIMITS: Record<
  NumberFieldName,
  {
    min: number;
    max: number;
    shortLabel: string;
  }
> = {
  height: {
    min: 24,
    max: 96,
    shortLabel: "24-96 in",
  },
  weight: {
    min: 50,
    max: 700,
    shortLabel: "50-700 lb",
  },
  goalWeight: {
    min: 50,
    max: 700,
    shortLabel: "50-700 lb",
  },
};

function ClientInfoStep({
  values,
  fitnessLevel,
  onFieldChange,
  onFitnessLevelChange,
}: ClientInfoStepProps) {
  const currentDate = today(getLocalTimeZone());
  const minDateOfBirth = currentDate.subtract({ years: 120 });
  const maxDateOfBirth = currentDate.subtract({ years: 13 });

  const dateValue: DateValue | null = values.dateOfBirth
    ? parseDate(values.dateOfBirth)
    : null;

  const getInputClass = (error: string) =>
    [
      "w-full outline outline-2 -outline-offset-1",
      error ? "outline-red-400" : "outline-transparent",
    ].join(" ");

  const isValidNumberInput = (value: string) => {
    return /^\d{0,3}(\.\d{0,1})?$/.test(value);
  };

  const getNumberError = (fieldName: NumberFieldName) => {
    const value = values[fieldName];
    const rules = NUMBER_LIMITS[fieldName];

    if (value.trim() === "") {
      return "";
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      return "Invalid";
    }

    if (numericValue < rules.min || numericValue > rules.max) {
      return rules.shortLabel;
    }

    return "";
  };

  const getDateOfBirthError = () => {
    if (!dateValue) {
      return "";
    }

    if (dateValue.compare(currentDate) > 0) {
      return "No future dates";
    }

    if (dateValue.compare(maxDateOfBirth) > 0) {
      return "Must be 13+";
    }

    if (dateValue.compare(minDateOfBirth) < 0) {
      return "Invalid date";
    }

    return "";
  };

  const handleNumberChange =
    (fieldName: NumberFieldName) => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (value === "") {
        onFieldChange(fieldName, value);
        return;
      }

      if (!isValidNumberInput(value)) {
        return;
      }

      const numericValue = Number(value);

      if (!Number.isFinite(numericValue) || numericValue < 0) {
        return;
      }

      onFieldChange(fieldName, value);
    };

  const handleDateChange = (value: DateValue | null) => {
    if (!value) {
      onFieldChange("dateOfBirth", "");
      return;
    }

    onFieldChange("dateOfBirth", value.toString());
  };

  const heightError = getNumberError("height");
  const weightError = getNumberError("weight");
  const goalWeightError = getNumberError("goalWeight");
  const dateOfBirthError = getDateOfBirthError();

  return (
    <div className="space-y-3">
      <div>
        <h2 className="mb-3 text-[13.125px] font-semibold text-black">
          Current Fitness Level
        </h2>

        <div className="grid grid-cols-3 gap-2">
          {clientFitnessOptions.map((option) => {
            const isSelected = fitnessLevel === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFitnessLevelChange(option.value)}
                className={[
                  "min-h-16 rounded-[18px] border px-1 py-1 text-center transition-all",
                  isSelected
                    ? "border-[#5B5EF4] ring-2 ring-[#DCDDFE]"
                    : "border-[#E4E4EC]",
                ].join(" ")}
              >
                <div className="text-[13.125px] font-semibold text-black">
                  {option.label}
                </div>
                <div className="mt-1 text-[10px] leading-4 text-[#62657a]">
                  {option.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-2 block text-[13.125px] font-semibold text-black">
            Height (in)
          </label>

          <Input
            type="number"
            value={values.height}
            placeholder="68"
            min={NUMBER_LIMITS.height.min}
            max={NUMBER_LIMITS.height.max}
            step="0.1"
            aria-invalid={Boolean(heightError)}
            onChange={handleNumberChange("height")}
            className={getInputClass(heightError)}
          />

          <p className="mt-1 h-4 text-[11px] leading-4 text-red-500">
            {heightError}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-[13.125px] font-semibold text-black">
            Weight (lb)
          </label>

          <Input
            type="number"
            value={values.weight}
            placeholder="155"
            min={NUMBER_LIMITS.weight.min}
            max={NUMBER_LIMITS.weight.max}
            step="0.1"
            aria-invalid={Boolean(weightError)}
            onChange={handleNumberChange("weight")}
            className={getInputClass(weightError)}
          />

          <p className="mt-1 h-4 text-[11px] leading-4 text-red-500">
            {weightError}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-[13.125px] font-semibold text-black">
            Goal (lb)
            <span className="ml-1 text-[11.25px] font-normal text-[#6E728C]">
              Optional
            </span>
          </label>

          <Input
            type="number"
            value={values.goalWeight}
            placeholder="145"
            min={NUMBER_LIMITS.goalWeight.min}
            max={NUMBER_LIMITS.goalWeight.max}
            step="0.1"
            aria-invalid={Boolean(goalWeightError)}
            onChange={handleNumberChange("goalWeight")}
            className={getInputClass(goalWeightError)}
          />

          <p className="mt-1 h-4 text-[11px] leading-4 text-red-500">
            {goalWeightError}
          </p>
        </div>
      </div>

      <div>
        <label className="mb-3 block text-[13.125px] font-semibold text-black">
          Date of Birth
        </label>

        <DatePicker
          className="w-full"
          value={dateValue}
          onChange={handleDateChange}
          minValue={minDateOfBirth}
          maxValue={maxDateOfBirth}
        >
          <DateField.Group fullWidth>
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>

            <DateField.Suffix>
              <DatePicker.Trigger>
                <DatePicker.TriggerIndicator />
              </DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>

          <div className="h-2">
            {dateOfBirthError && (
              <FieldError>
                <span className="text-[11px] leading-4 text-red-500">
                  {dateOfBirthError}
                </span>
              </FieldError>
            )}
          </div>

          <DatePicker.Popover>
            <Calendar aria-label="Date of birth">
              <Calendar.Header>
                <Calendar.YearPickerTrigger>
                  <Calendar.YearPickerTriggerHeading />
                  <Calendar.YearPickerTriggerIndicator />
                </Calendar.YearPickerTrigger>

                <Calendar.NavButton slot="previous" />
                <Calendar.NavButton slot="next" />
              </Calendar.Header>

              <Calendar.Grid>
                <Calendar.GridHeader>
                  {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                </Calendar.GridHeader>

                <Calendar.GridBody>
                  {(date) => <Calendar.Cell date={date} />}
                </Calendar.GridBody>
              </Calendar.Grid>

              <Calendar.YearPickerGrid>
                <Calendar.YearPickerGridBody>
                  {({ year }) => <Calendar.YearPickerCell year={year} />}
                </Calendar.YearPickerGridBody>
              </Calendar.YearPickerGrid>
            </Calendar>
          </DatePicker.Popover>
        </DatePicker>
      </div>
    </div>
  );
}

export default ClientInfoStep;
