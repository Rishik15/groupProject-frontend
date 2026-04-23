import React from "react";
import type { DateValue } from "@internationalized/date";
import {
    getLocalTimeZone,
    parseDate,
    today,
} from "@internationalized/date";
import {
    Button,
    Calendar,
    DateField,
    DatePicker,
    FieldError,
    Input,
    Label,
    Modal,
    Spinner,
} from "@heroui/react";
import {
    FileText,
    PlusCircle,
} from "lucide-react";
import type { CreatePredictionMarketPayload } from "../../../utils/Interfaces/Predictions/predictionForms";

type CreateGoalMarketModalProps = {
    isOpen: boolean;
    isSubmitting?: boolean;
    error?: string | null;
    initialValues?: Partial<CreatePredictionMarketPayload>;
    onClose: () => void;
    onSubmit: (payload: CreatePredictionMarketPayload) => void | Promise<void>;
};

type FormState = {
    title: string;
    goal_text: string;
};

const buildInitialState = (
    initialValues?: Partial<CreatePredictionMarketPayload>,
): FormState => ({
    title: initialValues?.title ?? "",
    goal_text: initialValues?.goal_text ?? "",
});

const parseInitialDate = (value?: string): DateValue | null => {
    if (!value) {
        return null;
    }

    try {
        return parseDate(value);
    } catch {
        return null;
    }
};

export default function CreateGoalMarketModal({
    isOpen,
    isSubmitting = false,
    error,
    initialValues,
    onClose,
    onSubmit,
}: CreateGoalMarketModalProps) {
    const [form, setForm] = React.useState<FormState>(
        buildInitialState(initialValues),
    );
    const [selectedDate, setSelectedDate] = React.useState<DateValue | null>(
        parseInitialDate(initialValues?.end_date),
    );
    const [validationError, setValidationError] = React.useState<string | null>(
        null,
    );

    React.useEffect(() => {
        if (!isOpen) {
            return;
        }

        setForm(buildInitialState(initialValues));
        setSelectedDate(parseInitialDate(initialValues?.end_date));
        setValidationError(null);
    }, [initialValues, isOpen]);

    const updateField = <K extends keyof FormState>(
        key: K,
        value: FormState[K],
    ) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const handleDateChange = (value: DateValue | null) => {
        setSelectedDate(value);

        if (validationError && value) {
            setValidationError(null);
        }
    };

    const handleSubmit = async () => {
        const title = form.title.trim();
        const goalText = form.goal_text.trim();

        if (!title) {
            setValidationError("Title is required.");
            return;
        }

        if (!goalText) {
            setValidationError("Goal text is required.");
            return;
        }

        if (!selectedDate) {
            setValidationError("End date is required.");
            return;
        }

        setValidationError(null);

        await onSubmit({
            title,
            goal_text: goalText,
            end_date: selectedDate.toString(),
        });
    };

    return (
        <Modal>
            <Modal.Backdrop
                isOpen={isOpen}
                onOpenChange={(open) => {
                    if (!open && !isSubmitting) {
                        onClose();
                    }
                }}
                variant="opaque"
                isDismissable={!isSubmitting}
            >
                <Modal.Container placement="center" size="lg" scroll="inside">
                    <Modal.Dialog
                        aria-label="Create prediction market"
                        className="rounded-3xl"
                    >
                        <Modal.Header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-[#5B5EF4]">
                                    <PlusCircle className="h-4 w-4" />
                                    Create Market
                                </div>
                                <h2 className="text-[18.75px] font-semibold text-slate-900">
                                    Create a new prediction market
                                </h2>
                                <p className="text-[13.125px] text-slate-500">
                                    Submit a clear title, goal description, and
                                    deadline.
                                </p>
                            </div>
                        </Modal.Header>

                        <Modal.Body className="space-y-5 px-6 py-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="prediction-market-title"
                                    className="text-[13.125px] font-medium text-slate-700"
                                >
                                    Title
                                </label>
                                <Input
                                    id="prediction-market-title"
                                    placeholder="Will I hit my target by the deadline?"
                                    value={form.title}
                                    variant="primary"
                                    disabled={isSubmitting}
                                    onChange={(event) =>
                                        updateField("title", event.target.value)
                                    }
                                    fullWidth
                                    aria-label="Market title"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="prediction-market-goal"
                                    className="text-[13.125px] font-medium text-slate-700"
                                >
                                    Goal text
                                </label>
                                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                    <div className="mb-2 inline-flex items-center gap-2 text-[11.25px] font-medium text-slate-500">
                                        <FileText className="h-4 w-4" />
                                        Goal details
                                    </div>
                                    <textarea
                                        id="prediction-market-goal"
                                        className="min-h-32 w-full resize-y border-0 bg-transparent text-[13.125px] text-slate-900 outline-none"
                                        placeholder="Describe the goal clearly and concretely."
                                        value={form.goal_text}
                                        disabled={isSubmitting}
                                        onChange={(event) =>
                                            updateField(
                                                "goal_text",
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <DatePicker
                                className="w-full gap-2"
                                value={selectedDate}
                                onChange={handleDateChange}
                                minValue={today(getLocalTimeZone())}
                                isDisabled={isSubmitting}
                            >
                                <Label className="text-[13.125px] font-medium text-slate-700">
                                    End date
                                </Label>

                                <DateField.Group
                                    fullWidth
                                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
                                >
                                    <DateField.Input className="min-h-8 flex-1">
                                        {(segment) => (
                                            <DateField.Segment
                                                segment={segment}
                                                className="rounded-md px-0.5 text-[13.125px] text-slate-900 data-[placeholder=true]:text-slate-400"
                                            />
                                        )}
                                    </DateField.Input>

                                    <DateField.Suffix>
                                        <DatePicker.Trigger className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100">
                                            <DatePicker.TriggerIndicator />
                                        </DatePicker.Trigger>
                                    </DateField.Suffix>
                                </DateField.Group>

                                <FieldError>
                                    End date must be today or in the future.
                                </FieldError>

                                <DatePicker.Popover className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                    <Calendar aria-label="Prediction market end date">
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
                                                {(day) => (
                                                    <Calendar.HeaderCell>
                                                        {day}
                                                    </Calendar.HeaderCell>
                                                )}
                                            </Calendar.GridHeader>

                                            <Calendar.GridBody>
                                                {(date) => (
                                                    <Calendar.Cell date={date} />
                                                )}
                                            </Calendar.GridBody>
                                        </Calendar.Grid>

                                        <Calendar.YearPickerGrid>
                                            <Calendar.YearPickerGridBody>
                                                {({ year }) => (
                                                    <Calendar.YearPickerCell
                                                        year={year}
                                                    />
                                                )}
                                            </Calendar.YearPickerGridBody>
                                        </Calendar.YearPickerGrid>
                                    </Calendar>
                                </DatePicker.Popover>
                            </DatePicker>

                            {(validationError || error) && (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13.125px] text-rose-700">
                                    {validationError ?? error}
                                </div>
                            )}
                        </Modal.Body>

                        <Modal.Footer className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-5">
                            <Button
                                variant="outline"
                                onPress={onClose}
                                isDisabled={isSubmitting}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="text-white"
                                style={{ backgroundColor: "#5B5EF4" }}
                                onPress={handleSubmit}
                                isDisabled={isSubmitting}
                            >
                                <span className="inline-flex items-center gap-2">
                                    {isSubmitting ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        <PlusCircle className="h-4 w-4" />
                                    )}
                                    Submit market
                                </span>
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}