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
  options: Array<{ value: string; label: string; helperText?: string }>;
  onChange: (value: string) => void;
}

export default function ScheduleSelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
}: ScheduleSelectFieldProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="min-w-0 space-y-1.5">
      <Select
        className="w-full min-w-0"
        variant="secondary"
        value={value}
        placeholder={placeholder}
        onChange={(nextValue) => {
          const parsedValue = getSingleSelectValue(nextValue);

          if (parsedValue) {
            onChange(parsedValue);
          }
        }}
      >
        <Label className="font-primary text-[12px] font-semibold text-[#0F0F14]">
          {label}
        </Label>

        <Select.Trigger className="min-h-[44px] w-full min-w-0 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 shadow-none">
          <div className="min-w-0 flex-1 overflow-hidden pr-3">
            <Select.Value className="block max-w-full truncate font-primary text-[14px] text-[#0F0F14]">
              {selectedOption?.label || placeholder}
            </Select.Value>
          </div>

          <Select.Indicator className="shrink-0 text-[#72728A]" />
        </Select.Trigger>

        <Select.Popover className="w-[var(--trigger-width)] rounded-xl border border-[#E5E7EB] bg-white p-1 shadow-lg">
          <ListBox className="max-h-[220px] overflow-y-auto outline-none">
            {options.map((option) => (
              <ListBox.Item
                key={option.value}
                id={option.value}
                textValue={option.label}
                className="rounded-lg px-3 py-2 data-[focused=true]:bg-indigo-50"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p className="truncate font-primary text-[14px] text-[#0F0F14]">
                    {option.label}
                  </p>

                  {option.helperText ? (
                    <p className="mt-0.5 truncate font-primary text-[12px] text-[#72728A]">
                      {option.helperText}
                    </p>
                  ) : null}
                </div>

                <ListBox.ItemIndicator className="shrink-0" />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
