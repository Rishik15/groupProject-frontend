import { useMemo, useState } from "react";
import { Button, Input, Modal, TextArea } from "@heroui/react";
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

// Keep the initial form state in one place so reset logic stays simple.
const getInitialValues = (): MealLogFormValues => ({
    mealType: "breakfast",
    mealName: "",
    foodItems: [],
    eatenAt: "",
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

    // Recalculate totals any time the list of food items changes.
    const totals = useMemo(
        () => calculateMealTotals(formValues.foodItems),
        [formValues.foodItems],
    );

    const resetForm = () => {
        setFormValues(getInitialValues());
    };

    // Generic form field updater for the top-level modal state.
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

    const handlePhotoChange = (file: File | null) => {
        if (!file) {
            updateField("photoFile", null);
            updateField("photoPreviewUrl", "");
            return;
        }

        // Store the local file and a local preview URL for the UI.
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

            // The backend currently expects a photo URL string, so for now we send
            // the default placeholder URL until real upload support is added.
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

                                {/* Remove padding from the scrollable body itself so the scrollbar
                    sits flush with the right edge. Put the spacing on the inner wrapper. */}
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
                                        />

                                        <SummaryCard totals={totals} />

                                        <div className="space-y-3">
                                            <p className="text-[18.75px] font-semibold text-[#0F0F14]">
                                                Meal Log Details
                                            </p>

                                            <div className="grid grid-cols-[2fr_0.9fr] gap-x-3 gap-y-3">
                                                <div className="min-w-0 space-y-1">
                                                    <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                                                        Eaten At
                                                    </label>
                                                    <Input
                                                        type="datetime-local"
                                                        value={formValues.eatenAt}
                                                        onChange={(event) => updateField("eatenAt", event.target.value)}
                                                        className="w-full text-[13.125px]"
                                                    />
                                                </div>

                                                <div className="min-w-0 space-y-1">
                                                    <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                                                        Servings
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={formValues.servings}
                                                        onChange={(event) => updateField("servings", event.target.value)}
                                                        className="w-full text-[13.125px]"
                                                    />
                                                </div>
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