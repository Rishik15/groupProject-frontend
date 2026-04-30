import { useState } from "react";
import type { DateValue } from "@internationalized/date";
import {
  Button,
  Calendar,
  Card,
  DateField,
  DatePicker,
  Label,
  Modal,
} from "@heroui/react";
import { assignMealPlan } from "@/services/nutrition/mealPlan";

interface Props {
  mealPlanId: number;
  planName: string;
  onClose: () => void;
  onSuccess: () => void;
}

function isMonday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getDay() === 1;
}

export default function AssignModal({
  mealPlanId,
  planName,
  onClose,
  onSuccess,
}: Props) {
  const [startDateValue, setStartDateValue] = useState<DateValue | null>(null);
  const [loading, setLoading] = useState(false);
  const [conflict, setConflict] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startDate = startDateValue ? startDateValue.toString() : "";

  async function handleAssign(force = false) {
    if (!startDate) {
      setError("Please select a start date.");
      return;
    }

    if (!isMonday(startDate)) {
      setError("Start date must be a Monday.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await assignMealPlan({
        meal_plan_id: mealPlanId,
        start_date: startDate,
        force,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setConflict(err.response.data.existing_plan_name ?? "Another plan");
      } else {
        setError(err?.response?.data?.error || "Failed to assign plan.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal.Backdrop
      isOpen
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      variant="opaque"
    >
      <Modal.Container placement="center" size="sm">
        <Modal.Dialog className="sm:max-w-[390px]">
          <Modal.CloseTrigger />

          <Modal.Header className="flex flex-col gap-1">
            <Modal.Heading className="text-[18px] font-bold text-black">
              Assign Plan
            </Modal.Heading>

            <p className="text-[12px] text-[#72728A]">
              Pick the Monday this plan should start.
            </p>
          </Modal.Header>

          <Modal.Body className="flex flex-col gap-4">
            <Card
              variant="transparent"
              className="border border-[#E6E6EE] bg-[#FAFAFF] p-3"
            >
              <p className="text-[12px] text-[#72728A]">Selected plan</p>
              <p className="mt-1 text-[14px] font-semibold text-black">
                {planName}
              </p>
            </Card>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
                {error}
              </div>
            )}

            {conflict && (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2">
                <p className="text-[14px] font-semibold text-yellow-800">
                  Plan conflict
                </p>

                <p className="mt-1 text-[12px] text-yellow-700">
                  {conflict} is already assigned for this week. You can replace
                  it or choose another Monday.
                </p>
              </div>
            )}

            <DatePicker
              className="w-full"
              name="start_date"
              value={startDateValue}
              onChange={(value) => {
                setStartDateValue(value);
                setError(null);
                setConflict(null);
              }}
            >
              <Label className="text-[12px] font-semibold text-[#72728A]">
                Start Date
              </Label>

              <DateField.Group
                fullWidth
                variant="secondary"
                className="h-10 rounded-xl border border-[#E6E6EE] bg-white px-3"
              >
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
                <Calendar aria-label="Start date">
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
                        <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                      )}
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
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              className="text-[12px] font-semibold"
              onPress={onClose}
            >
              Cancel
            </Button>

            {conflict ? (
              <Button
                isDisabled={loading}
                className="bg-[#5E5EF4] text-[12px] font-semibold text-white"
                onPress={() => handleAssign(true)}
              >
                {loading ? "Replacing..." : "Replace Plan"}
              </Button>
            ) : (
              <Button
                isDisabled={loading}
                className="bg-[#5E5EF4] text-[12px] font-semibold text-white"
                onPress={() => handleAssign(false)}
              >
                {loading ? "Assigning..." : "Assign"}
              </Button>
            )}
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
