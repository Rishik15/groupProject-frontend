import { Calendar, DateField, DatePicker, Label } from "@heroui/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { useMemo } from "react";

interface ScheduleDateFieldProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ScheduleDateField({ value, onChange }: ScheduleDateFieldProps) {
    const dateValue = useMemo(() => {
        try {
            return parseDate(value);
        } catch {
            return today(getLocalTimeZone());
        }
    }, [value]);

    return (
        <DatePicker
            aria-label="Workout date"
            className="w-full"
            value={dateValue}
            onChange={(nextValue) => {
                if (nextValue) {
                    onChange(nextValue.toString());
                }
            }}
        >
            <Label className="text-[13.125px] font-medium text-[#0F0F14]">
                Date
            </Label>

            <DateField.Group
                className="rounded-xl border border-[#E5E7EB] bg-white"
                fullWidth
                variant="secondary"
            >
                <DateField.Input className="px-3 text-[13.125px] text-[#0F0F14]">
                    {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>

                <DateField.Suffix>
                    <DatePicker.Trigger className="px-3 text-[#72728A]">
                        <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                </DateField.Suffix>
            </DateField.Group>

            <DatePicker.Popover className="rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-lg">
                <Calendar aria-label="Workout date">
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
                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                        </Calendar.GridHeader>

                        <Calendar.GridBody>
                            {(date) => <Calendar.Cell date={date} />}
                        </Calendar.GridBody>
                    </Calendar.Grid>

                    <Calendar.YearPickerGrid>
                        <Calendar.YearPickerGridBody>
                            {({ year }) => <Calendar.YearPickerCell year={year} />}
                        </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                </Calendar>
            </DatePicker.Popover>
        </DatePicker>
    );
}
