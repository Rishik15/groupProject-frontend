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
import type { FoodItemDraft, MealLogFormValues } from "../../../utils/Interfaces/MealLogging/mealLog";
import { createMealLog } from "../../../services/MealLogging/mealLogService";
import {
    buildMealLogPayload,
    calculateMealTotals,
    createEmptyFoodItemDraft,
    mapSuggestionToDraft,
    validateMealLogForm,
} from "../../../utils/MealLogging/mealLogHelpers";
import type { FoodItemSuggestion } from "../../../utils/Interfaces/MealLogging/mealLog";
import FoodItemLibrarySearch from "./FoodItemLibrarySearch";
import FoodItemRow from "./FoodItemRow";
import SummaryCard from "./SummaryCard";

const SUPPORTED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
]);

const getInitialValues = (): MealLogFormValues => ({
    mealType: "breakfast",
    mealName: "",
    foodItems: [],
    eatenOn: null,
    eatenTime: null,
    servings: "1",
    notes: "",
    photoFile: null,
    photoPreviewUrl: "",
});

const revokeBlobUrl = (url?: string) => {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
};

interface FoodItemTabProps {
    onSuccess?: () => void;
}

export default function FoodItemTab({ onSuccess }: FoodItemTabProps) {
    const [formValues, setFormValues] = useState<MealLogFormValues>(getInitialValues());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totals = useMemo(
        () => calculateMealTotals(formValues.foodItems),
        [formValues.foodItems],
    );

    const updateField = <K extends keyof MealLogFormValues>(
        field: K,
        value: MealLogFormValues[K],
    ) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleFoodItemChange = (clientId: string, field: keyof FoodItemDraft, value: string) => {
        setFormValues((prev) => ({
            ...prev,
            foodItems: prev.foodItems.map((item) =>
                item.clientId === clientId ? { ...item, [field]: value } : item,
            ),
        }));
    };
    const handleAddFoodItem = (item: FoodItemDraft) => {
        setFormValues((prev) => ({
            ...prev,
            foodItems: [...prev.foodItems, item],
            // Auto-set meal name from first food item if not already set
            mealName: prev.mealName || item.name,
        }));
    };
    const handleRemoveFoodItem = (clientId: string) => {
        setFormValues((prev) => {
            const toRemove = prev.foodItems.find((i) => i.clientId === clientId);
            revokeBlobUrl(toRemove?.imagePreviewUrl);
            return { ...prev, foodItems: prev.foodItems.filter((i) => i.clientId !== clientId) };
        });
    };

    const handleFoodItemPhotoChange = (clientId: string, file: File | null) => {
        setFormValues((prev) => ({
            ...prev,
            foodItems: prev.foodItems.map((item) => {
                if (item.clientId !== clientId) return item;
                revokeBlobUrl(item.imagePreviewUrl);
                if (!file) return { ...item, imageFile: null, imagePreviewUrl: "" };
                return { ...item, imageFile: file, imagePreviewUrl: URL.createObjectURL(file) };
            }),
        }));
    };

    const handlePhotoChange = (file: File | null) => {
        revokeBlobUrl(formValues.photoPreviewUrl);
        if (!file) {
            updateField("photoFile", null);
            updateField("photoPreviewUrl", "");
            return;
        }
        if (!SUPPORTED_IMAGE_TYPES.has(file.type)) {
            updateField("photoFile", null);
            updateField("photoPreviewUrl", "");
            return;
        }
        updateField("photoFile", file);
        updateField("photoPreviewUrl", URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        const validationError = validateMealLogForm(formValues);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            const payload = buildMealLogPayload(formValues);
            await createMealLog(payload, formValues.photoFile);

            setFormValues((prev) => {
                revokeBlobUrl(prev.photoPreviewUrl);
                prev.foodItems.forEach((item) => revokeBlobUrl(item.imagePreviewUrl));
                return getInitialValues();
            });

            onSuccess?.();
        } catch {
            setError("Failed to log meal. Please try again.");
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

            {/* Food items section */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <p className="text-[18.75px] font-semibold text-[#0F0F14]">Food Items</p>
                    <p className="text-[13.125px] text-[#72728A]">
                        Add food items from your saved list or create your own.
                    </p>
                </div>

                <FoodItemLibrarySearch
                    onSelectItem={(item: FoodItemSuggestion) =>
                        handleAddFoodItem(mapSuggestionToDraft(item))
                    }
                />

                <Button
                    variant="outline"
                    className="border-[#5E5EF4] text-[#5E5EF4]"
                    onPress={() => handleAddFoodItem(createEmptyFoodItemDraft())}
                >
                    Add Custom Food Item
                </Button>

                <div className="space-y-3">
                    {formValues.foodItems.map((item) => (
                        <FoodItemRow
                            key={item.clientId}
                            item={item}
                            onChange={handleFoodItemChange}
                            onRemove={handleRemoveFoodItem}
                            onPhotoChange={handleFoodItemPhotoChange}
                        />
                    ))}
                </div>
            </div>

            <SummaryCard totals={totals} />

            {/* Log details */}
            <div className="space-y-3">
                <p className="text-[18.75px] font-semibold text-[#0F0F14]">Meal Log Details</p>

                <div className="grid grid-cols-[1.2fr_0.9fr] gap-x-3 gap-y-3">
                    <DatePicker
                        className="w-full"
                        value={formValues.eatenOn}
                        onChange={(value) => updateField("eatenOn", value)}
                        maxValue={today(getLocalTimeZone())}
                    >
                        <Label className="text-[13.125px] font-medium text-[#0F0F14]">Date</Label>
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
                        value={formValues.eatenTime}
                        onChange={(value) => updateField("eatenTime", value)}
                        granularity="minute"
                        hourCycle={12}
                    >
                        <Label className="text-[13.125px] font-medium text-[#0F0F14]">Time</Label>
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
                        min={1}
                        value={formValues.servings}
                        onChange={(e) => updateField("servings", e.target.value)}
                        className="w-full text-[13.125px]"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-[13.125px] font-medium text-[#0F0F14]">Notes</label>
                    <TextArea
                        placeholder="Optional notes about the meal"
                        value={formValues.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                        className="w-full text-[13.125px]"
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-[13.125px] font-medium text-[#0F0F14]">Meal Photo</p>
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
                        onPress={() => document.getElementById("food-item-photo-input")?.click()}
                    >
                        {formValues.photoFile ? "Change Photo" : "Add Photo (optional)"}
                    </Button>
                    {formValues.photoPreviewUrl && (
                        <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-xl border border-default-200 bg-default-50 p-2">
                            <img
                                src={formValues.photoPreviewUrl}
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