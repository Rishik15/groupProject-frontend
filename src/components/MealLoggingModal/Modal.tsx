import { useMemo, useState } from "react";
import {
    Button,
    Calendar,
    DateField,
    DatePicker,
    Input,
    Label,
    Modal,
    TextArea,
    TimeField,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";

import type {
    FoodItemDraft,
    MealLogFormValues,
} from "../../utils/Interfaces/MealLogging/mealLog";
import {
    createMealLog,
    getDefaultMealPhotoUrl,
} from "../../services/MealLogging/mealLogService";
import {
    buildMealLogPayload,
    calculateMealTotals,
    validateMealLogForm,
} from "../../utils/MealLogging/mealLogHelpers";

import FoodItemsSection from "./FoodItemsSection";
import Footer from "./Footer";
import Header from "./Header";
import SummaryCard from "./SummaryCard";
import MealTypeSelector from "./MealTypeSelector";

interface MealLoggingModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

// Keep the starting form values in one place so reset logic stays simple.
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

export default function MealLoggingModal({
    isOpen,
    onOpenChange,
    onSuccess,
}: MealLoggingModalProps) {
    const [formValues, setFormValues] = useState<MealLogFormValues>(
        getInitialValues(),
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Recalculate meal totals whenever the food item list changes.
    const totals = useMemo(
        () => calculateMealTotals(formValues.foodItems),
        [formValues.foodItems],
    );

    const resetForm = () => {
        setFormValues(getInitialValues());
    };

    // Generic updater for top-level modal form fields.
    const updateField = <K extends keyof MealLogFormValues>(
        field: K,
        value: MealLogFormValues[K],
    ) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFoodItemChange = (
        clientId: string,
        field: keyof FoodItemDraft,
        value: string,
    ) => {
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
        }));
    };

    const handleRemoveFoodItem = (clientId: string) => {
        setFormValues((prev) => ({
            ...prev,
            foodItems: prev.foodItems.filter((item) => item.clientId !== clientId),
        }));
    };

    // Store a local uploaded image for an individual food item.
    // This gives the user preview support even though the backend still expects a URL later.
    const handleFoodItemPhotoChange = (clientId: string, file: File | null) => {
        setFormValues((prev) => ({
            ...prev,
            foodItems: prev.foodItems.map((item) => {
                if (item.clientId !== clientId) {
                    return item;
                }

                if (!file) {
                    return {
                        ...item,
                        imageFile: null,
                        imagePreviewUrl: "",
                    };
                }

                return {
                    ...item,
                    imageFile: file,
                    imagePreviewUrl: URL.createObjectURL(file),
                };
            }),
        }));
    };

    // Store a local uploaded image for the overall meal photo.
    const handlePhotoChange = (file: File | null) => {
        if (!file) {
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
            console.error(validationError);
            return;
        }

        try {
            setIsSubmitting(true);

            // Backend still expects a photo_url string, so keep using the default placeholder
            // until real upload-to-URL support is added.
            const photoUrl = getDefaultMealPhotoUrl();

            const payload = buildMealLogPayload(formValues, photoUrl);

            console.log("Meal log payload:", payload);

            await createMealLog(payload);

            resetForm();
            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error("Failed to log meal:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal>
            <Modal.Backdrop
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                variant="opaque"
            >
                <Modal.Container placement="center" scroll="inside" size="lg">
                    <Modal.Dialog className="w-full max-w-[500px] overflow-hidden rounded-2xl bg-white">
                        {({ close }) => (
                            <>
                                <Modal.CloseTrigger />

                                <Modal.Header className="pb-0">
                                    <Header />
                                </Modal.Header>

                                {/* Keep padding off the scrollable body itself so the scrollbar
                    stays flush with the modal edge. */}
                                <Modal.Body className="p-0">
                                    <div className="space-y-6 px-6 py-2">
                                        <MealTypeSelector
                                            value={formValues.mealType}
                                            onChange={(value) => updateField("mealType", value)}
                                        />

                                        <div className="space-y-1">
                                            <label className="block text-[13.125px] font-semibold text-[#0F0F14]">
                                                Meal Name
                                            </label>
                                            <Input
                                                placeholder="e.g. Chicken Salad Bowl"
                                                value={formValues.mealName}
                                                onChange={(event) =>
                                                    updateField("mealName", event.target.value)
                                                }
                                                className="h-[37.5px] w-full text-[13.125px]"
                                            />
                                        </div>

                                        <FoodItemsSection
                                            items={formValues.foodItems}
                                            onChangeItem={handleFoodItemChange}
                                            onRemoveItem={handleRemoveFoodItem}
                                            onAddItem={handleAddFoodItem}
                                            onFoodItemPhotoChange={handleFoodItemPhotoChange}
                                        />

                                        <SummaryCard totals={totals} />

                                        <div className="space-y-3">
                                            <p className="text-[18.75px] font-semibold text-[#0F0F14]">
                                                Meal Log Details
                                            </p>

                                            <div className="grid grid-cols-[1.2fr_0.9fr] gap-x-3 gap-y-3">
                                                <DatePicker
                                                    className="w-full"
                                                    value={formValues.eatenOn}
                                                    onChange={(value) => updateField("eatenOn", value)}
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
                                                            {(segment) => (
                                                                <DateField.Segment segment={segment} />
                                                            )}
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
                                                                    {(day) => (
                                                                        <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                                                                    )}
                                                                </Calendar.GridHeader>

                                                                <Calendar.GridBody>
                                                                    {(date) => <Calendar.Cell date={date} />}
                                                                </Calendar.GridBody>
                                                            </Calendar.Grid>

                                                            <Calendar.YearPickerGrid>
                                                                <Calendar.YearPickerGridBody>
                                                                    {({ year }) => (
                                                                        <Calendar.YearPickerCell year={year} />
                                                                    )}
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
                                                    <Label className="text-[13.125px] font-medium text-[#0F0F14]">
                                                        Time
                                                    </Label>

                                                    <TimeField.Group
                                                        className="rounded-xl border border-default-200 bg-white"
                                                        fullWidth
                                                        variant="secondary"
                                                    >
                                                        <TimeField.Input className="px-3 text-[13.125px]">
                                                            {(segment) => (
                                                                <TimeField.Segment segment={segment} />
                                                            )}
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
                                                    onChange={(event) =>
                                                        updateField("servings", event.target.value)
                                                    }
                                                    className="w-full text-[13.125px]"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                                                    Notes
                                                </label>
                                                <TextArea
                                                    placeholder="Optional notes about the meal"
                                                    value={formValues.notes}
                                                    onChange={(event) =>
                                                        updateField("notes", event.target.value)
                                                    }
                                                    className="w-full text-[13.125px]"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-[13.125px] font-medium text-[#0F0F14]">
                                                    Meal Photo
                                                </p>

                                                <input
                                                    id="meal-photo-input"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(event) =>
                                                        handlePhotoChange(event.target.files?.[0] ?? null)
                                                    }
                                                />

                                                <Button
                                                    variant="outline"
                                                    className="w-full border-default-200 text-[#0F0F14]"
                                                    onPress={() =>
                                                        document.getElementById("meal-photo-input")?.click()
                                                    }
                                                >
                                                    {formValues.photoFile
                                                        ? "Change Photo"
                                                        : "Add Photo (optional)"}
                                                </Button>

                                                {formValues.photoPreviewUrl && (
                                                    <img
                                                        src={formValues.photoPreviewUrl}
                                                        alt="Meal preview"
                                                        className="h-40 w-full rounded-xl object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Footer
                                        isSubmitting={isSubmitting}
                                        onClose={close}
                                        onSubmit={handleSubmit}
                                    />
                                </Modal.Footer>
                            </>
                        )}
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}