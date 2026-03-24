import { useEffect, useMemo, useState } from "react";
import {
    ComboBox,
    Description,
    Input,
    Label,
    ListBox,
} from "@heroui/react";
import type { FoodItemSuggestion } from "../../utils/Interfaces/MealLogging/mealLog";
import { getFoodItems } from "../../services/MealLogging/mealLogService";

interface FoodItemLibrarySearchProps {
    onSelectItem: (item: FoodItemSuggestion) => void;
}

export default function FoodItemLibrarySearch({
    onSelectItem,
}: FoodItemLibrarySearchProps) {
    const [foodItems, setFoodItems] = useState<FoodItemSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    useEffect(() => {
        // Load the user's saved food items once when the combobox mounts.
        const loadFoodItems = async () => {
            try {
                setLoading(true);
                const items = await getFoodItems();
                setFoodItems(items);
            } catch (error) {
                console.error("Failed to load saved food items:", error);
                setFoodItems([]);
            } finally {
                setLoading(false);
            }
        };

        loadFoodItems();
    }, []);

    // Filter locally so the user does not need to type the exact full food name.
    const filteredFoodItems = useMemo(() => {
        const normalizedQuery = inputValue.trim().toLowerCase();

        if (!normalizedQuery) {
            return foodItems;
        }

        return foodItems.filter((item) =>
            item.name.toLowerCase().includes(normalizedQuery),
        );
    }, [foodItems, inputValue]);

    const handleSelectionChange = (key: string | number | null) => {
        const normalizedKey = key === null ? null : String(key);
        setSelectedKey(normalizedKey);

        if (normalizedKey === null) {
            return;
        }

        const selectedItem = foodItems.find(
            (item) => String(item.food_item_id) === normalizedKey,
        );

        if (!selectedItem) {
            return;
        }

        // Send the selected saved food item back up to the modal section.
        onSelectItem(selectedItem);

        // Clear the combobox so the user can quickly add another item.
        setInputValue("");
        setSelectedKey(null);
    };

    return (
        <div className="space-y-1">
            <ComboBox
                className="w-full"
                inputValue={inputValue}
                selectedKey={selectedKey}
                items={filteredFoodItems}
                onInputChange={setInputValue}
                onSelectionChange={handleSelectionChange}
                menuTrigger="input"
                isDisabled={loading}
            >
                <Label className="text-[13.125px] font-medium text-[#0F0F14]">
                    Search Saved Food Items
                </Label>

                <ComboBox.InputGroup>
                    <Input
                        placeholder={
                            loading ? "Loading saved food items..." : "Search saved food items"
                        }
                        className="text-[13.125px]"
                    />
                    <ComboBox.Trigger />
                </ComboBox.InputGroup>

                <Description className="text-[11.25px] text-[#72728A]">
                    Select a saved food item to add it to this meal.
                </Description>

                <ComboBox.Popover>
                    {filteredFoodItems.length === 0 ? (
                        <div className="px-3 py-2 text-[13.125px] text-[#72728A]">
                            {inputValue.trim()
                                ? "No matching food items found."
                                : "No saved food items yet."}
                        </div>
                    ) : (
                        <ListBox>
                            {(item: FoodItemSuggestion) => (
                                <ListBox.Item
                                    id={String(item.food_item_id)}
                                    textValue={item.name}
                                    className="rounded-xl"
                                >
                                    <div className="flex flex-col py-1">
                                        <span className="text-[13.125px] font-medium text-[#0F0F14]">
                                            {item.name}
                                        </span>
                                        <span className="text-[11.25px] text-[#72728A]">
                                            {item.calories} cal · {item.protein}P · {item.carbs}C ·{" "}
                                            {item.fats}F
                                        </span>
                                    </div>
                                </ListBox.Item>
                            )}
                        </ListBox>
                    )}
                </ComboBox.Popover>
            </ComboBox>
        </div>
    );
}