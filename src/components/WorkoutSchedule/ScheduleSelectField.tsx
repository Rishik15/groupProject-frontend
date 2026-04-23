import { Label, ListBox, Select } from "@heroui/react";
import type { Key } from "@heroui/react";

function getSingleSelectValue(value: Key | Key[] | null) {
    if (typeof value === "string" || typeof value === "number") {
        return String(value);
    }

    if (Array.isArray(value) && value.length > 0) {
        return String(value[0]);
    }

    return null;
}

interface ScheduleSelectFieldProps {
    label: string;
    value: string;
    placeholder: string;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string) => void;
}

export default function ScheduleSelectField({
    label,
    value,
    placeholder,
    options,
    onChange,
}: ScheduleSelectFieldProps) {
    return (
        <Select
            className="w-full"
            variant="secondary"
            value={value}
            onChange={(nextValue) => {
                const parsedValue = getSingleSelectValue(nextValue);
                if (parsedValue) {
                    onChange(parsedValue);
                }
            }}
            placeholder={placeholder}
        >
            <Label className="text-[13.125px] font-medium text-[#0F0F14]">
                {label}
            </Label>

            <Select.Trigger className="min-h-[44px] rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 shadow-none">
                <Select.Value className="text-[13.125px] text-[#0F0F14]" />
                <Select.Indicator className="text-[#72728A]" />
            </Select.Trigger>

            <Select.Popover className="rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-lg">
                <ListBox className="outline-none">
                    {options.map((option) => (
                        <ListBox.Item
                            key={option.value}
                            id={option.value}
                            textValue={option.label}
                            className="rounded-lg px-3 py-2 text-[13.125px] text-[#0F0F14] data-[focused=true]:bg-[#F8FAFC]"
                        >
                            {option.label}
                            <ListBox.ItemIndicator />
                        </ListBox.Item>
                    ))}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}
