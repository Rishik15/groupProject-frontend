import { useEffect, useMemo, useState } from "react";
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Button,
  Card,
  DateField,
  FieldError,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  Separator,
} from "@heroui/react";
import {
  assignMealPlan,
  createMealPlan,
  getMeals,
} from "@/services/nutrition/mealPlan";
import type {
  DayOfWeek,
  MealLibraryItem,
  MealSlot,
  MealType,
} from "@/utils/Interfaces/Nutrition/mealPlan";
import { DAYS, MEAL_TYPES } from "@/utils/Interfaces/Nutrition/mealPlan";

function isMonday(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getDay() === 1;
}

export default function CreateMealPlan() {
  const [planName, setPlanName] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Mon");
  const [selectedType, setSelectedType] = useState<MealType>("breakfast");
  const [slots, setSlots] = useState<MealSlot[]>([]);
  const [meals, setMeals] = useState<MealLibraryItem[]>([]);
  const [mealSearch, setMealSearch] = useState("");
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [startDateValue, setStartDateValue] = useState<DateValue | null>(null);
  const [endDateValue, setEndDateValue] = useState<DateValue | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<number | null>(null);

  const todayDate = today(getLocalTimeZone());

  const startDate = startDateValue ? startDateValue.toString() : "";
  const endDate = endDateValue ? endDateValue.toString() : "";

  const isStartPast =
    startDateValue !== null && startDateValue.compare(todayDate) < 0;

  const isStartNotMonday = startDate !== "" && !isMonday(startDate);

  const isEndBeforeStart =
    startDateValue !== null &&
    endDateValue !== null &&
    endDateValue.compare(startDateValue) < 0;

  const startDateError = isStartPast
    ? "Start date must be today or later."
    : isStartNotMonday
      ? "Start date must be a Monday."
      : "";

  const endDateError = isEndBeforeStart
    ? "End date must be after the start date."
    : "";

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const data = await getMeals();
        setMeals(data);
      } catch {
        setError("Failed to load meals.");
      }
    };

    loadMeals();
  }, []);

  const filteredMeals = useMemo(() => {
    const query = mealSearch.trim().toLowerCase();

    if (!query) {
      return meals;
    }

    return meals.filter((meal) => meal.name.toLowerCase().includes(query));
  }, [meals, mealSearch]);

  const selectedMeal = meals.find((meal) => meal.meal_id === selectedMealId);

  function addSlot() {
    if (!selectedMeal) {
      setError("Please select a meal.");
      return;
    }

    setSlots((prev) => [
      ...prev,
      {
        day: selectedDay,
        meal_type: selectedType,
        meal_id: selectedMeal.meal_id,
        meal_name: selectedMeal.name,
        servings: 1,
      },
    ]);

    setSelectedMealId(null);
    setMealSearch("");
    setError(null);
  }

  function removeSlot(index: number) {
    setSlots((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }

  async function handleAssign(planId: number, force = false) {
    await assignMealPlan({
      meal_plan_id: planId,
      start_date: startDate,
      force,
    });
  }

  function resetForm() {
    setPlanName("");
    setSelectedDay("Mon");
    setSelectedType("breakfast");
    setSlots([]);
    setMealSearch("");
    setSelectedMealId(null);
    setStartDateValue(null);
    setEndDateValue(null);
  }

  async function handleSave() {
    if (!planName.trim()) {
      setError("Plan name is required.");
      return;
    }

    if (slots.length === 0) {
      setError("Add at least one meal.");
      return;
    }

    if (!startDateValue) {
      setError("Please select a start date.");
      return;
    }

    if (!endDateValue) {
      setError("Please select an end date.");
      return;
    }

    if (isStartPast) {
      setError("Start date must be today or later.");
      return;
    }

    if (isStartNotMonday) {
      setError("Start date must be a Monday.");
      return;
    }

    if (isEndBeforeStart) {
      setError("End date must be after the start date.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await createMealPlan({
        plan_name: planName,
        start_date: startDate,
        end_date: endDate,
        meals: slots.map((slot) => ({
          day_of_week: slot.day,
          meal_type: slot.meal_type,
          meal_id: slot.meal_id,
          servings: slot.servings,
        })),
      });

      try {
        await handleAssign(res.meal_plan_id);
        setSuccess(true);
        resetForm();
      } catch (assignErr: any) {
        if (assignErr?.response?.status === 409) {
          setPendingPlanId(res.meal_plan_id);
          setShowConflictModal(true);
        } else {
          setError("Plan created but failed to assign.");
        }
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create plan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleForceAssign() {
    if (!pendingPlanId) {
      return;
    }

    setSaving(true);
    setShowConflictModal(false);

    try {
      await handleAssign(pendingPlanId, true);
      setSuccess(true);
      setPendingPlanId(null);
      resetForm();
    } catch {
      setError("Failed to assign plan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="border border-[#E6E6EE] bg-white px-4 py-2  shadow-sm">
      <Card.Header className="flex flex-col items-start gap-1 px-4 py-3">
        <Card.Title className="text-[18px] font-bold text-black">
          Create Meal Plan
        </Card.Title>

        <Card.Description className="text-[12px] text-[#72728A]">
          Build a weekly plan from your meal library.
        </Card.Description>
      </Card.Header>

      <Separator />

      <Card.Content className="flex flex-col gap-3 px-4 py-4">
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-[13px] text-green-600">
            Plan created and assigned successfully.
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_180px]">
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-semibold text-[#72728A]">
                  Plan Name
                </label>

                <Input
                  placeholder="Example: High Protein Week"
                  value={planName}
                  onChange={(event) => {
                    setPlanName(event.target.value);
                    setSuccess(false);
                  }}
                  className="h-10 rounded-xl border border-[#E6E6EE] px-3 text-[14px] outline-none focus:border-[#5E5EF4]"
                />
              </div>

              <DateField
                isRequired
                className="w-full"
                name="start_date"
                value={startDateValue}
                minValue={todayDate}
                isInvalid={isStartPast || isStartNotMonday}
                onChange={(value) => {
                  setStartDateValue(value);
                  setError(null);

                  if (
                    endDateValue &&
                    value &&
                    endDateValue.compare(value) < 0
                  ) {
                    setEndDateValue(null);
                  }
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
                  <DateField.Input className="text-[14px]">
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                </DateField.Group>

                {(isStartPast || isStartNotMonday) && (
                  <FieldError className="text-[12px] text-red-600">
                    {startDateError}
                  </FieldError>
                )}
              </DateField>

              <DateField
                isRequired
                className="w-full"
                name="end_date"
                value={endDateValue}
                minValue={startDateValue ?? todayDate}
                isInvalid={isEndBeforeStart}
                onChange={(value) => {
                  setEndDateValue(value);
                  setError(null);
                }}
              >
                <Label className="text-[12px] font-semibold text-[#72728A]">
                  End Date
                </Label>

                <DateField.Group
                  fullWidth
                  variant="secondary"
                  className="h-10 rounded-xl border border-[#E6E6EE] bg-white px-3"
                >
                  <DateField.Input className="text-[14px]">
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                </DateField.Group>

                {isEndBeforeStart && (
                  <FieldError className="text-[12px] text-red-600">
                    {endDateError}
                  </FieldError>
                )}
              </DateField>
            </div>

            <div className="mt-10 rounded-2xl border border-[#E6E6EE] bg-[#FAFAFF] p-3">
              <div className="mb-3">
                <p className="text-[16px] font-bold text-black">Add a Meal</p>
                <p className="text-[12px] text-[#72728A]">
                  Pick a day, type, and meal.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 lg:grid-cols-[130px_130px_1fr_74px]">
                <Select
                  value={selectedDay}
                  onChange={(value) => setSelectedDay(value as DayOfWeek)}
                  placeholder="Day"
                  variant="secondary"
                  className="w-full"
                >
                  <Label className="sr-only">Day</Label>
                  <Select.Trigger className="h-10 rounded-xl border border-[#E6E6EE] bg-white px-3 text-[14px]">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>

                  <Select.Popover>
                    <ListBox>
                      {DAYS.map((day) => (
                        <ListBox.Item
                          key={day.key}
                          id={day.key}
                          textValue={day.label}
                        >
                          {day.label}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  value={selectedType}
                  onChange={(value) => setSelectedType(value as MealType)}
                  placeholder="Type"
                  variant="secondary"
                  className="w-full"
                >
                  <Label className="sr-only">Meal type</Label>
                  <Select.Trigger className="h-10 rounded-xl border border-[#E6E6EE] bg-white px-3 text-[14px] capitalize">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>

                  <Select.Popover>
                    <ListBox>
                      {MEAL_TYPES.map((type) => (
                        <ListBox.Item key={type} id={type} textValue={type}>
                          <span className="capitalize">{type}</span>
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  value={selectedMealId ? String(selectedMealId) : null}
                  onChange={(value) =>
                    setSelectedMealId(value ? Number(value) : null)
                  }
                  placeholder="Select meal..."
                  variant="secondary"
                  className="w-full"
                >
                  <Label className="sr-only">Meal</Label>
                  <Select.Trigger className="h-10 rounded-xl border border-[#E6E6EE] bg-white px-3 text-[14px]">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>

                  <Select.Popover>
                    <ListBox>
                      {filteredMeals.map((meal) => (
                        <ListBox.Item
                          key={meal.meal_id}
                          id={String(meal.meal_id)}
                          textValue={meal.name}
                        >
                          {meal.name}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Button
                  variant="tertiary"
                  className="h-10 rounded-xl bg-[#5E5EF4] px-4 text-[14px] font-semibold text-white hover:bg-[#4B4EE4]"
                  onPress={addSlot}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          <Card
            variant="transparent"
            className="flex h-[45vh] min-h-[260px] flex-col border border-[#E6E6EE] bg-white p-0"
          >
            <Card.Header className="flex items-center justify-between px-4 py-3">
              <div>
                <Card.Title className="text-[16px] font-bold text-black">
                  Added Meals
                </Card.Title>
              </div>

              <span className="mt-1 rounded-full bg-[#EDEBFF] px-3 py-1 text-[12px] font-semibold text-[#5E5EF4]">
                {slots.length}
              </span>
            </Card.Header>

            <Separator />

            <Card.Content className="flex min-h-0 flex-1 flex-col gap-3 p-3">
              <div className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {slots.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#D8D8E8] bg-[#FAFAFF] p-4 text-center">
                    <p className="text-[14px] text-[#72728A]">
                      No meals added yet.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {slots.map((slot, index) => (
                      <div
                        key={`${slot.meal_id}-${slot.day}-${slot.meal_type}-${index}`}
                        className="rounded-xl border border-[#E6E6EE] bg-[#FAFAFF] px-3 py-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-semibold text-black">
                              {slot.meal_name}
                            </p>
                            <p className="text-[12px] capitalize text-[#72728A]">
                              {slot.day} · {slot.meal_type}
                            </p>
                          </div>

                          <Button
                            variant="tertiary"
                            className="h-7 rounded-lg px-2 text-[12px] font-semibold text-red-500 hover:bg-red-50"
                            onPress={() => removeSlot(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant="tertiary"
                className="h-10 w-full shrink-0 rounded-xl bg-[#5E5EF4] text-[14px] font-semibold text-white hover:bg-[#4B4EE4] disabled:opacity-60"
                isDisabled={saving}
                onPress={handleSave}
              >
                {saving ? "Saving..." : "Save Plan"}
              </Button>
            </Card.Content>
          </Card>
        </div>
      </Card.Content>

      <Modal.Backdrop
        isOpen={showConflictModal}
        onOpenChange={setShowConflictModal}
        variant="opaque"
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="sm:max-w-[390px]">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading className="text-[18px] font-bold text-black">
                Meal Plan Conflict
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <p className="text-[14px] text-[#72728A]">
                There is already a meal plan assigned for this week. Do you want
                to replace it?
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                className="text-[12px] font-semibold"
                onPress={() => setShowConflictModal(false)}
              >
                Cancel
              </Button>

              <Button
                variant="tertiary"
                className="bg-[#5E5EF4] text-[12px] font-semibold text-white hover:bg-[#4B4EE4]"
                isDisabled={saving}
                onPress={handleForceAssign}
              >
                {saving ? "Replacing..." : "Replace"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Card>
  );
}
