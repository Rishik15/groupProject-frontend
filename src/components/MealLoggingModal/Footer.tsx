import { Button } from "@heroui/react";

interface FooterProps {
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export default function Footer({
    isSubmitting,
    onClose,
    onSubmit,
}: FooterProps) {
    return (
        <div className="flex w-full justify-end gap-2">
            <Button variant="ghost" className="text-[#72728A]" onPress={onClose}>
                Cancel
            </Button>

            {/* Show a simple loading label while the API request is running. */}
            <Button
                variant="primary"
                className="bg-[#5E5EF4] text-white"
                onPress={onSubmit}
            >
                {isSubmitting ? "Logging Meal..." : "Log Meal"}
            </Button>
        </div>
    );
}