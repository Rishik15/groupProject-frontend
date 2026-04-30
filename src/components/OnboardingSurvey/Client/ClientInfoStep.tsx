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

function ClientInfoStep({
  values,
  fitnessLevel,
  onFieldChange,
  onFitnessLevelChange,
}: ClientInfoStepProps) {
  // Reuse one handler factory for number inputs so the non-negative rule stays
  // consistent without repeating the same check in every field.
  const handleNonNegativeChange =
    (fieldName: "height" | "weight" | "goalWeight") =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // Allow an empty string while the user is editing, but block negatives
        // from entering state.
        if (value === "" || Number(value) >= 0) {
          onFieldChange(fieldName, value);
        }
      };

  const dateValue: DateValue | null = values.dateOfBirth
    ? parseDate(values.dateOfBirth)
    : null;

  const handleDateChange = (value: DateValue | null) => {
    if (!value) {
      onFieldChange("dateOfBirth", "");
      return;
    }

    onFieldChange("dateOfBirth", value.toString()); // YYYY-MM-DD
  };

  return (
    <div className="space-y-4">
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
                data-testid={option.label}
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
            data-testid="height"
            value={values.height}
            placeholder="68"
            onChange={handleNonNegativeChange("height")}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-2 block text-[13.125px] font-semibold text-black">
            Weight (lb)
          </label>
          <Input
            type="number"
            data-testid="weight"
            value={values.weight}
            placeholder="155"
            onChange={handleNonNegativeChange("weight")}
            className="w-full"
          />
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
            data-testid="goal_weight"
            value={values.goalWeight}
            placeholder="145"
            onChange={handleNonNegativeChange("goalWeight")}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="mb-4 block text-[13.125px] font-semibold text-black">
          Date of Birth
        </label>

        <DatePicker
          className="w-full"
          data-testid="dob"
          value={dateValue}
          onChange={handleDateChange}
          maxValue={today(getLocalTimeZone())}
        >
          <DateField.Group fullWidth>
            <DateField.Input data-testid="dob-input">
              {(segment) => <DateField.Segment  segment={segment} />}
            </DateField.Input>

            <DateField.Suffix>
              <DatePicker.Trigger>
                <DatePicker.TriggerIndicator />
              </DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <FieldError>Date must be today or in the future.</FieldError>

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
                  {(date) => <Calendar.Cell date={date}       data-testid={`date-${date.toString()}`}/>}
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
