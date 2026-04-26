import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  Input,
  Label,
  TextArea,
  TimeField,
} from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { CalendarDate, Time } from "@internationalized/date";
import type { TodayMeal } from "../../../services/meallogging/logMealService";

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

interface MealPlanLogFormProps {
  meal: TodayMeal;
  eatenOn: CalendarDate | null;
  eatenTime: Time | null;
  servings: string;
  notes: string;
  photoFile: File | null;
  photoPreviewUrl: string;
  isSubmitting: boolean;
  onEatenOnChange: (value: CalendarDate | null) => void;
  onEatenTimeChange: (value: Time | null) => void;
  onServingsChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onPhotoChange: (file: File | null) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function MealPlanLogForm({
  meal,
  eatenOn,
  eatenTime,
  servings,
  notes,
  photoFile,
  photoPreviewUrl,
  isSubmitting,
  onEatenOnChange,
  onEatenTimeChange,
  onServingsChange,
  onNotesChange,
  onPhotoChange,
  onBack,
  onSubmit,
}: MealPlanLogFormProps) {
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      onPhotoChange(null);
      return;
    }

    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      onPhotoChange(null);
      return;
    }

    onPhotoChange(file);
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-[13.125px] text-[#5E5EF4]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to meals
      </button>

      <div className="rounded-xl bg-[#F7F7FB] p-3">
        <p className="text-[13.125px] font-semibold text-[#0F0F14]">
          {meal.name}
        </p>
        <p className="text-[11.25px] text-[#72728A]">
          {meal.calories} kcal · {meal.protein}P · {meal.carbs}C · {meal.fats}F
        </p>
      </div>

      <div className="grid grid-cols-[1.2fr_0.9fr] gap-x-3 gap-y-3">
        <DatePicker
          className="w-full"
          value={eatenOn}
          onChange={onEatenOnChange}
          maxValue={today(getLocalTimeZone())}
        >
          <Label className="text-[13.125px] font-medium text-[#0F0F14]">
            Date
          </Label>

          <DateField.Group
            className="rounded-xl border border-default-200 bg-white"
            fullWidth
            variant="secondary"
          >
            <DateField.Input className="px-3 text-[13.125px]">
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>
              <DatePicker.Trigger className="px-3">
                <DatePicker.TriggerIndicator />
              </DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>

          <DatePicker.Popover className="rounded-xl p-2">
            <Calendar aria-label="Meal date">
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

        <TimeField
          className="w-full"
          value={eatenTime}
          onChange={onEatenTimeChange}
          granularity="minute"
          hourCycle={12}
        >
          <Label className="text-[13.125px] font-medium text-[#0F0F14]">
            Time
          </Label>

          <TimeField.Group
            className="rounded-xl border border-default-200 bg-white"
            fullWidth
            variant="secondary"
          >
            <TimeField.Input className="px-3 text-[13.125px]">
              {(segment) => <TimeField.Segment segment={segment} />}
            </TimeField.Input>
          </TimeField.Group>
        </TimeField>
      </div>

      <div className="space-y-1">
        <label className="block text-[13.125px] font-medium text-[#0F0F14]">
          Servings
        </label>
        <Input
          type="number"
          min={0.25}
          step={0.25}
          value={servings}
          onChange={(e) => onServingsChange(e.target.value)}
          className="w-full text-[13.125px]"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-[13.125px] font-medium text-[#0F0F14]">
          Notes
        </label>
        <TextArea
          placeholder="Optional notes about the meal"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full text-[13.125px]"
        />
      </div>

      <div className="space-y-2">
        <p className="text-[13.125px] font-medium text-[#0F0F14]">Meal Photo</p>

        <input
          id="meal-plan-photo-input"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={handlePhotoChange}
        />

        <Button
          variant="outline"
          className="w-full border-default-200 text-[#0F0F14]"
          onPress={() =>
            document.getElementById("meal-plan-photo-input")?.click()
          }
        >
          {photoFile ? "Change Photo" : "Add Photo (optional)"}
        </Button>

        {photoPreviewUrl && (
          <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-default-200 bg-default-50 p-2">
            <img
              src={photoPreviewUrl}
              alt="Meal preview"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </div>

      <Button
        className="w-full bg-[#5E5EF4] text-white"
        onPress={onSubmit}
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Logging..." : "Log Meal"}
      </Button>
    </div>
  );
}
