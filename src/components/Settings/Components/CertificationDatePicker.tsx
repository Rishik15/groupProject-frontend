import {
    DatePicker,
    DateField,
    Calendar,
    Label,
} from "@heroui/react";
import type { CalendarDate } from "@internationalized/date";

type Props = {
    label: string;
    value: CalendarDate | null;
    index: number;
    onChange: (value: CalendarDate | null) => void;
};

export default function CertificationDatePicker({
    label,
    value,
    onChange,
    index
}: Props) {
    return (
        <DatePicker className="w-full" value={value} onChange={onChange}>
            <Label>{label}</Label>

            <DateField.Group fullWidth>
                <DateField.Input data-testid={label + index}>
                    {(segment) => <DateField.Segment segment={segment} />}
                </DateField.Input>

                <DateField.Suffix>
                    <DatePicker.Trigger>
                        <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                </DateField.Suffix>
            </DateField.Group>

            <DatePicker.Popover className="w-fit">
                <Calendar aria-label={label} className="p-4">
                    <Calendar.Header>
                        <Calendar.YearPickerTrigger>
                            <Calendar.YearPickerTriggerHeading />
                            <Calendar.YearPickerTriggerIndicator />
                        </Calendar.YearPickerTrigger>

                        <div className="flex gap-2">
                            <Calendar.NavButton slot="previous" />
                            <Calendar.NavButton slot="next" />
                        </div>
                    </Calendar.Header>

                    <Calendar.Grid className="mt-3">
                        <Calendar.GridHeader>
                            {(day) => (
                                <Calendar.HeaderCell className="text-gray-500 text-sm">
                                    {day}
                                </Calendar.HeaderCell>
                            )}
                        </Calendar.GridHeader>

                        <Calendar.GridBody>
                            {(date) => (
                                <Calendar.Cell
                                    date={date}
                                />
                            )}
                        </Calendar.GridBody>
                    </Calendar.Grid>

                    <Calendar.YearPickerGrid>
                        <Calendar.YearPickerGridBody>
                            {({ year }) => (
                                <Calendar.YearPickerCell year={year} />
                            )}
                        </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                </Calendar>
            </DatePicker.Popover>
        </DatePicker>
    );
}