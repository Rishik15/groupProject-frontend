import { Button } from "@heroui/react";
import { Plus } from "lucide-react";

interface LogMealButtonProps {
    onPress: () => void;
}

const LogMealButton = ({ onPress }: LogMealButtonProps) => {
    return (
        <Button
            className="h-[30px] min-w-[97px] rounded-xl bg-[#5E5EF4] px-3 text-[13.125px] font-medium text-white"
            onPress={onPress}
        >
            <Plus className="h-4 w-4" />
            <span>Log Meal</span>
        </Button>
    );
};

export default LogMealButton;