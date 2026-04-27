import { useMemo, useState } from "react";
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
import { getLocalTimeZone, today } from "@internationalized/date";
import type { CalendarDate, Time } from "@internationalized/date";
import { logFoodItem } from "../../../services/meallogging/logMealService";

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

interface FoodItemTabProps {
  onSuccess?: () => void;
}

const pad = (value: number) => String(value).padStart(2, "0");

const buildEatenAt = (date: CalendarDate | null, time: Time | null) => {
  if (!date || !time) return "";

  return `${date.year}-${pad(date.month)}-${pad(date.day)}T${pad(
    time.hour,
  )}:${pad(time.minute)}:00`;
};

const parseValue = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const revokeBlobUrl = (url: string) => {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
};

export default function FoodItemTab({ onSuccess }: FoodItemTabProps) {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fats, setFats] = useState("");
  const [servings, setServings] = useState("1");
  const [eatenOn, setEatenOn] = useState<CalendarDate | null>(null);
  const [eatenTime, setEatenTime] = useState<Time | null>(null);
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    const servingCount = parseValue(servings) || 1;

    return {
      calories: Math.round(parseValue(calories) * servingCount),
      protein: Math.round(parseValue(protein) * servingCount * 10) / 10,
      carbs: Math.round(parseValue(carbs) * servingCount * 10) / 10,
      fats: Math.round(parseValue(fats) * servingCount * 10) / 10,
    };
  }, [calories, protein, carbs, fats, servings]);

  const handlePhotoChange = (file: File | null) => {
    revokeBlobUrl(photoPreviewUrl);

    if (!file) {
      setPhotoFile(null);
      setPhotoPreviewUrl("");
      return;
    }

    if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
      setPhotoFile(null);
      setPhotoPreviewUrl("");
      setError("Please upload a valid image file.");
      return;
    }

    setError(null);
    setPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    revokeBlobUrl(photoPreviewUrl);

    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFats("");
    setServings("1");
    setEatenOn(null);
    setEatenTime(null);
    setNotes("");
    setPhotoFile(null);
    setPhotoPreviewUrl("");
  };

  const handleSubmit = async () => {
    const parsedCalories = Number(calories);
    const parsedProtein = Number(protein);
    const parsedCarbs = Number(carbs);
    const parsedFats = Number(fats);
    const parsedServings = Number(servings);
    const eaten_at = buildEatenAt(eatenOn, eatenTime);

    if (!name.trim()) {
      setError("Food name is required.");
      return;
    }

    if (!Number.isFinite(parsedCalories) || parsedCalories < 0) {
      setError("Calories must be a valid number.");
      return;
    }

    if (!Number.isFinite(parsedProtein) || parsedProtein < 0) {
      setError("Protein must be a valid number.");
      return;
    }

    if (!Number.isFinite(parsedCarbs) || parsedCarbs < 0) {
      setError("Carbs must be a valid number.");
      return;
    }

    if (!Number.isFinite(parsedFats) || parsedFats < 0) {
      setError("Fats must be a valid number.");
      return;
    }

    if (!Number.isFinite(parsedServings) || parsedServings <= 0) {
      setError("Servings must be greater than 0.");
      return;
    }

    if (!eaten_at) {
      setError("Date and time are required.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await logFoodItem({
        name,
        calories: parsedCalories,
        protein: parsedProtein,
        carbs: parsedCarbs,
        fats: parsedFats,
        servings: parsedServings,
        eaten_at,
        notes,
        photoFile,
      });

      resetForm();
      onSuccess?.();
    } catch {
      setError("Failed to log food item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-[13.125px] text-red-600">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <p className="text-[18.75px] font-semibold text-[#0F0F14]">Food Item</p>
        <p className="text-[13.125px] text-[#72728A]">
          Enter the food item details and log when you ate it.
        </p>
      </div>

      <div className="rounded-2xl border border-default-200 p-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="block text-[13.125px] font-medium text-[#0F0F14]">
              Food Name
            </label>
            <Input
              placeholder="e.g. Homemade oatmeal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-[13.125px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            <div className="space-y-1">
              <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                Calories
              </label>
              <Input
                type="number"
                min={0}
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full text-[13.125px]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                Protein (g)
              </label>
              <Input
                type="number"
                min={0}
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full text-[13.125px]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                Carbs (g)
              </label>
              <Input
                type="number"
                min={0}
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full text-[13.125px]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                Fats (g)
              </label>
              <Input
                type="number"
                min={0}
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                className="w-full text-[13.125px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-[#F7F7FB] p-4">
        <p className="text-[18.75px] font-semibold text-[#0F0F14]">
          Meal Summary
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11.25px] uppercase tracking-wide text-[#72728A]">
              Calories
            </p>
            <p className="text-[18.75px] font-semibold text-[#5E5EF4]">
              {totals.calories}
            </p>
          </div>

          <div>
            <p className="text-[11.25px] uppercase tracking-wide text-[#72728A]">
              Protein
            </p>
            <p className="text-[18.75px] font-semibold text-[#5E5EF4]">
              {totals.protein} g
            </p>
          </div>

          <div>
            <p className="text-[11.25px] uppercase tracking-wide text-[#72728A]">
              Carbs
            </p>
            <p className="text-[18.75px] font-semibold text-[#5E5EF4]">
              {totals.carbs} g
            </p>
          </div>

          <div>
            <p className="text-[11.25px] uppercase tracking-wide text-[#72728A]">
              Fats
            </p>
            <p className="text-[18.75px] font-semibold text-[#5E5EF4]">
              {totals.fats} g
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[18.75px] font-semibold text-[#0F0F14]">
          Meal Log Details
        </p>

        <div className="grid grid-cols-[1.2fr_0.9fr] gap-x-3 gap-y-3">
          <DatePicker
            className="w-full"
            value={eatenOn}
            onChange={setEatenOn}
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
            onChange={setEatenTime}
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
            onChange={(e) => setServings(e.target.value)}
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
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-[13.125px]"
          />
        </div>

        <div className="space-y-2">
          <p className="text-[13.125px] font-medium text-[#0F0F14]">
            Meal Photo
          </p>

          <input
            id="food-item-photo-input"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={(e) => handlePhotoChange(e.target.files?.[0] ?? null)}
          />

          <Button
            variant="outline"
            className="w-full border-default-200 text-[#0F0F14]"
            onPress={() =>
              document.getElementById("food-item-photo-input")?.click()
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
      </div>

      <Button
        className="w-full bg-[#5E5EF4] text-white"
        onPress={handleSubmit}
        isDisabled={isSubmitting}
      >
        {isSubmitting ? "Logging Meal..." : "Log Meal"}
      </Button>
    </div>
  );
}
