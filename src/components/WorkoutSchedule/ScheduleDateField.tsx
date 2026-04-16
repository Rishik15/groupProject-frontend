import { Calendar, DateField, DatePicker } from "@heroui/react";
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
        <div className="space-y-2">
            <label className="text-[11.25px] font-semibold text-[#0F0F14]">Date</label>

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
                <DateField.Group fullWidth>
                    <DateField.Input>
                        {(segment) => <DateField.Segment segment={segment} />}
                    </DateField.Input>

                    <DateField.Suffix>
                        <DatePicker.Trigger>
                            <DatePicker.TriggerIndicator />
                        </DatePicker.Trigger>
                    </DateField.Suffix>
                </DateField.Group>

                <DatePicker.Popover>
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
        </div>
    );
}
