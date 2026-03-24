import { Input } from "@heroui/react";

interface WorkoutLogFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export default function WorkoutLogField({
  label,
  placeholder,
  value,
  onValueChange,
  className = "",
}: WorkoutLogFieldProps) {
  return (
    <div className={`min-w-0 space-y-2 ${className}`}>
      <label className="text-[11.25px] font-semibold text-[#0F0F14]">
        {label}
      </label>

      <Input
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange(event.currentTarget.value)}
        className="w-full min-w-0"
      />
    </div>
  );
}
