import { type ChangeEvent } from "react";
import { Button, Card, Input } from "@heroui/react";
import type { FoodItemDraft } from "../../utils/Interfaces/MealLogging/mealLog";

interface FoodItemRowProps {
    item: FoodItemDraft;
    onChange: (clientId: string, field: keyof FoodItemDraft, value: string) => void;
    onRemove: (clientId: string) => void;
    onPhotoChange: (clientId: string, file: File | null) => void;
}

export default function FoodItemRow({
    item,
    onChange,
    onRemove,
}: FoodItemRowProps) {
    const handleFieldChange =
        (field: keyof FoodItemDraft) => (event: ChangeEvent<HTMLInputElement>) => {
            onChange(item.clientId, field, event.target.value);
        };

    return (
        <Card className="rounded-2xl border border-default-200">
            <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                    <p className="text-[13.125px] font-medium text-[#0F0F14]">
                        {item.isCustom ? "Custom Food Item" : "Saved Food Item"}
                    </p>

                    <Button
                        variant="ghost"
                        className="text-[#72728A]"
                        onPress={() => onRemove(item.clientId)}
                    >
                        Remove
                    </Button>
                </div>

                <div className="space-y-1">
                    <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                        Food Name
                    </label>
                    <Input
                        placeholder="e.g. Chicken breast"
                        value={item.name}
                        onChange={handleFieldChange("name")}
                        className="w-full text-[13.125px]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                    <div className="min-w-0 space-y-1">
                        <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                            Calories
                        </label>
                        <Input
                            type="number"
                            min={0}
                            value={item.calories}
                            onChange={handleFieldChange("calories")}
                            className="w-full text-[13.125px]"
                        />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                            Protein (g)
                        </label>
                        <Input
                            type="number"
                            min={0}
                            value={item.protein}
                            onChange={handleFieldChange("protein")}
                            className="w-full text-[13.125px]"
                        />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                            Carbs (g)
                        </label>
                        <Input
                            type="number"
                            min={0}
                            value={item.carbs}
                            onChange={handleFieldChange("carbs")}
                            className="w-full text-[13.125px]"
                        />
                    </div>

                    <div className="min-w-0 space-y-1">
                        <label className="block text-[13.125px] font-medium text-[#0F0F14]">
                            Fat (g)
                        </label>
                        <Input
                            type="number"
                            min={0}
                            value={item.fats}
                            onChange={handleFieldChange("fats")}
                            className="w-full text-[13.125px]"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}