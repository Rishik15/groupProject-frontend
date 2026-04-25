import { Button } from "@heroui/react";
import type {
    FoodItemDraft,
    FoodItemSuggestion,
} from "../../utils/Interfaces/MealLogging/mealLog";
import {
    createEmptyFoodItemDraft,
    mapSuggestionToDraft,
} from "../../utils/MealLogging/mealLogHelpers";
import FoodItemLibrarySearch from "./FoodItemLibrarySearch";
import FoodItemRow from "./FoodItemRow";

interface FoodItemsSectionProps {
    items: FoodItemDraft[];
    onChangeItem: (
        clientId: string,
        field: keyof FoodItemDraft,
        value: string,
    ) => void;
    onRemoveItem: (clientId: string) => void;
    onAddItem: (item: FoodItemDraft) => void;
    onFoodItemPhotoChange: (clientId: string, file: File | null) => void;
}

export default function FoodItemsSection({
    items,
    onChangeItem,
    onRemoveItem,
    onAddItem,
    onFoodItemPhotoChange,
}: FoodItemsSectionProps) {
    const hasItem = items.length > 0;

    const handleSelectLibraryItem = (item: FoodItemSuggestion) => {
        onAddItem(mapSuggestionToDraft(item));
    };

    const handleAddCustomItem = () => {
        onAddItem(createEmptyFoodItemDraft());
    };

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <p className="text-[18.75px] font-semibold text-[#0F0F14]">
                    Food Item
                </p>
                <p className="text-[13.125px] text-[#72728A]">
                    Select a saved food item or create a custom one.
                </p>
            </div>

            {!hasItem && (
                <>
                    <FoodItemLibrarySearch onSelectItem={handleSelectLibraryItem} />

                    <Button
                        variant="outline"
                        className="border-[#5E5EF4] text-[#5E5EF4]"
                        onPress={handleAddCustomItem}
                    >
                        Add Custom Food Item
                    </Button>
                </>
            )}

            <div className="space-y-3">
                {items.map((item) => (
                    <FoodItemRow
                        key={item.clientId}
                        item={item}
                        onChange={onChangeItem}
                        onRemove={onRemoveItem}
                        onPhotoChange={onFoodItemPhotoChange}
                    />
                ))}
            </div>
        </div>
    );
}