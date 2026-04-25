import { Button, Input, TextArea } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import type { TodayMeal } from "../../../services/MealLogging/mealPlanLogService";

const SUPPORTED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
]);

interface MealPlanLogFormProps {
    meal: TodayMeal;
    servings: string;
    notes: string;
    photoFile: File | null;
    photoPreviewUrl: string;
    isSubmitting: boolean;
    onServingsChange: (value: string) => void;
    onNotesChange: (value: string) => void;
    onPhotoChange: (file: File | null) => void;
    onBack: () => void;
    onSubmit: () => void;
}

export default function MealPlanLogForm({
    meal,
    servings,
    notes,
    photoFile,
    photoPreviewUrl,
    isSubmitting,
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

            {/* Meal summary */}
            <div className="rounded-xl bg-[#F7F7FB] p-3">
                <p className="text-[13.125px] font-semibold text-[#0F0F14]">
                    {meal.name}
                </p>
                <p className="text-[11.25px] text-[#72728A]">
                    {meal.calories} kcal · {meal.protein}P · {meal.carbs}C · {meal.fats}F
                </p>
            </div>

            {/* Servings */}
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

            {/* Notes */}
            <div className="space-y-1">
                <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                    Notes (optional)
                </label>
                <TextArea
                    placeholder="How did it taste? Any modifications?"
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    className="w-full text-[13.125px]"
                />
            </div>

            {/* Photo */}
            <div className="space-y-2">
                <p className="text-[13.125px] font-medium text-[#0F0F14]">
                    Meal Photo (optional)
                </p>

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
                    {photoFile ? "Change Photo" : "Add Photo"}
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