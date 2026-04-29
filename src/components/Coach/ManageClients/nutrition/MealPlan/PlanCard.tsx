import { useState } from "react";
import {
  Button,
  Card,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  Separator,
} from "@heroui/react";
import {
  deleteManageClientMealPlan,
  getManageClientMealPlanDetail,
  getManageClientMeals,
  updateManageClientMealPlan,
} from "@/services/ManageClients/nutrition/mealPlan";
import type {
  AssignedMealPlan,
  DayOfWeek,
  MealLibraryItem,
  MealPlanDetail,
  MealType,
} from "@/utils/Interfaces/Nutrition/mealPlan";
import { DAYS, MEAL_TYPES } from "@/utils/Interfaces/Nutrition/mealPlan";

type Props = {
  contractId: number;
  plan: AssignedMealPlan;
  onPlanUpdated?: () => void;
  onPlanDeleted?: () => void;
};

const formatNumber = (value: number) => {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
};

export default function PlanCard({
  contractId,
  plan,
  onPlanUpdated,
  onPlanDeleted,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [detail, setDetail] = useState<MealPlanDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const [planName, setPlanName] = useState(plan.plan_name);
  const [headerPlanName, setHeaderPlanName] = useState(plan.plan_name);
  const [headerCalories, setHeaderCalories] = useState(
    Number(plan.total_calories ?? 0),
  );

  const [systemMeals, setSystemMeals] = useState<MealLibraryItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Mon");
  const [selectedType, setSelectedType] = useState<MealType>("breakfast");
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDetail() {
    setLoading(true);

    try {
      const data = await getManageClientMealPlanDetail(
        contractId,
        plan.meal_plan_id,
      );

      setDetail(data);
      setPlanName(data.plan_name);
      setHeaderPlanName(data.plan_name);
      setHeaderCalories(Number(data.total_calories ?? 0));
    } finally {
      setLoading(false);
    }
  }

  async function handleExpand() {
    if (!expanded && !detail) {
      await loadDetail();
    }

    setExpanded((value) => !value);
  }

  async function handleEdit() {
    if (!detail) {
      await loadDetail();
    }

    const meals = await getManageClientMeals();

    setSystemMeals(meals);
    setEditing(true);
    setExpanded(true);
  }

  async function handleDeletePlan() {
    setDeleting(true);
    setError(null);

    try {
      await deleteManageClientMealPlan(contractId, plan.meal_plan_id);
      setShowDeleteModal(false);
      onPlanDeleted?.();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to delete meal plan.");
    } finally {
      setDeleting(false);
    }
  }

  async function saveUpdate(body: object) {
    setSaving(true);
    setError(null);

    try {
      const result = await updateManageClientMealPlan(contractId, {
        meal_plan_id: plan.meal_plan_id,
        ...body,
      });

      if (result.deleted) {
        onPlanDeleted?.();
        return;
      }

      if (typeof result.total_calories === "number") {
        setHeaderCalories(result.total_calories);
      }

      if ("plan_name" in body && typeof body.plan_name === "string") {
        setHeaderPlanName(body.plan_name);
      }

      await loadDetail();
      onPlanUpdated?.();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to update meal plan.");
    } finally {
      setSaving(false);
    }
  }

  async function savePlanName() {
    const cleanedName = planName.trim();

    if (!cleanedName) {
      setError("Plan name cannot be empty.");
      return;
    }

    await saveUpdate({ plan_name: cleanedName });
    setEditing(false);
  }

  async function addMeal() {
    if (!selectedMealId) {
      setError("Please select a meal.");
      return;
    }

    await saveUpdate({
      add_meals: [
        {
          meal_id: selectedMealId,
          day_of_week: selectedDay,
          meal_type: selectedType,
          servings: 1,
        },
      ],
    });

    setSelectedMealId(null);
  }

  return (
    <>
      <Card className="border border-[#E6E6EE] bg-white p-0 shadow-sm">
        <Card.Header className="flex flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          {editing ? (
            <Input
              value={planName}
              onChange={(event) => setPlanName(event.target.value)}
              className="h-9 max-w-sm rounded-xl border border-[#E6E6EE] px-3 text-[14px] font-semibold outline-none focus:border-[#5E5EF4]"
            />
          ) : (
            <div>
              <Card.Title className="text-[14px] font-bold text-black">
                {headerPlanName}
              </Card.Title>

              <Card.Description className="mt-0.5 text-[12px] text-[#72728A]">
                {plan.start_date} → {plan.end_date}
              </Card.Description>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#EDEBFF] px-3 py-1 text-[12px] font-semibold text-[#5E5EF4]">
              {headerCalories} kcal
            </span>

            {editing ? (
              <>
                <Button
                  variant="tertiary"
                  className="h-8 rounded-xl bg-[#5E5EF4] px-3 text-[12px] font-semibold text-white hover:bg-[#4B4EE4] disabled:opacity-60"
                  isDisabled={saving || deleting}
                  onPress={savePlanName}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>

                <Button
                  variant="secondary"
                  className="h-8 rounded-xl px-3 text-[12px] font-semibold"
                  isDisabled={saving || deleting}
                  onPress={() => setEditing(false)}
                >
                  Done
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                className="h-8 rounded-xl px-3 text-[12px] font-semibold"
                isDisabled={deleting}
                onPress={handleEdit}
              >
                Edit
              </Button>
            )}

            <Button
              variant="secondary"
              className={`h-8 rounded-xl px-3 text-[12px] font-semibold ${
                expanded ? "bg-[#EDEBFF] text-[#5E5EF4]" : ""
              }`}
              isDisabled={deleting}
              onPress={handleExpand}
            >
              {expanded ? "Collapse" : "Expand"}
            </Button>

            <Button
              variant="tertiary"
              className="h-8 rounded-xl px-3 text-[12px] font-semibold text-red-500 hover:bg-red-50 disabled:opacity-60"
              isDisabled={saving || deleting}
              onPress={() => setShowDeleteModal(true)}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Card.Header>

        {error && (
          <div className="mx-4 mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-600">
            {error}
          </div>
        )}

        {expanded && (
          <>
            <Separator />

            <Card.Content className="flex flex-col gap-4 px-4 py-4">
              {loading ? (
                <p className="text-[12px] text-[#72728A]">Loading plan...</p>
              ) : detail ? (
                <>
                  {DAYS.map((day) => {
                    const dayMeals = detail.meals.filter(
                      (meal) => meal.day_of_week === day.key,
                    );

                    if (dayMeals.length === 0) {
                      return null;
                    }

                    return (
                      <div key={day.key}>
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-[12px] font-bold uppercase tracking-wide text-[#72728A]">
                            {day.label}
                          </p>

                          <p className="text-[12px] text-[#72728A]">
                            {dayMeals.length} meal
                            {dayMeals.length === 1 ? "" : "s"}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          {dayMeals.map((meal, index) => {
                            const servings = Number(meal.servings ?? 1);

                            return (
                              <div
                                key={`${meal.meal_id}-${meal.day_of_week}-${meal.meal_type}-${index}`}
                                className="flex flex-col gap-2 rounded-xl border border-[#E6E6EE] bg-[#FAFAFF] px-3 py-2 md:flex-row md:items-center md:justify-between"
                              >
                                <div>
                                  <p className="text-[14px] font-semibold text-black">
                                    {meal.name}
                                  </p>

                                  <p className="text-[12px] capitalize text-[#72728A]">
                                    {meal.meal_type}
                                  </p>
                                </div>

                                {editing ? (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[12px] font-medium text-[#72728A]">
                                        Servings
                                      </span>

                                      <Input
                                        type="number"
                                        min={0.5}
                                        step={0.5}
                                        defaultValue={String(meal.servings)}
                                        className="h-8 w-20 rounded-lg border border-[#E6E6EE] px-2 text-center text-[12px] outline-none focus:border-[#5E5EF4]"
                                        onBlur={(event) => {
                                          const newServings = Number(
                                            event.target.value,
                                          );

                                          if (
                                            !newServings ||
                                            newServings <= 0
                                          ) {
                                            setError(
                                              "Servings must be greater than 0.",
                                            );
                                            return;
                                          }

                                          if (newServings === servings) {
                                            return;
                                          }

                                          saveUpdate({
                                            update_servings: [
                                              {
                                                meal_id: meal.meal_id,
                                                day_of_week: meal.day_of_week,
                                                meal_type: meal.meal_type,
                                                servings: newServings,
                                              },
                                            ],
                                          });
                                        }}
                                      />
                                    </div>

                                    <Button
                                      variant="tertiary"
                                      className="h-8 rounded-lg px-3 text-[12px] font-semibold text-red-500 hover:bg-red-50"
                                      isDisabled={saving || deleting}
                                      onPress={() =>
                                        saveUpdate({
                                          remove_meals: [
                                            {
                                              meal_id: meal.meal_id,
                                              day_of_week: meal.day_of_week,
                                              meal_type: meal.meal_type,
                                            },
                                          ],
                                        })
                                      }
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex flex-wrap gap-1.5">
                                    <span className="rounded-full bg-[#EDEBFF] px-2 py-0.5 text-[12px] font-medium text-[#5E5EF4]">
                                      {formatNumber(servings)} serving
                                      {servings === 1 ? "" : "s"}
                                    </span>

                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[12px] text-[#55556A]">
                                      {meal.calories} kcal
                                    </span>

                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[12px] text-blue-600">
                                      {meal.protein}g P
                                    </span>

                                    <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-[12px] text-yellow-700">
                                      {meal.carbs}g C
                                    </span>

                                    <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[12px] text-pink-600">
                                      {meal.fats}g F
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {editing && (
                    <div className="border-t border-[#E6E6EE] pt-4">
                      <p className="mb-3 text-[12px] font-bold uppercase tracking-wide text-[#72728A]">
                        Add Meal
                      </p>

                      <div className="grid grid-cols-1 gap-2 lg:grid-cols-[130px_130px_1fr_auto]">
                        <Select
                          value={selectedDay}
                          onChange={(value) =>
                            setSelectedDay(value as DayOfWeek)
                          }
                          placeholder="Day"
                          variant="secondary"
                          className="w-full"
                        >
                          <Label className="sr-only">Day</Label>

                          <Select.Trigger className="h-9 rounded-xl border border-[#E6E6EE] bg-white px-3 text-[12px]">
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
                          onChange={(value) =>
                            setSelectedType(value as MealType)
                          }
                          placeholder="Type"
                          variant="secondary"
                          className="w-full"
                        >
                          <Label className="sr-only">Meal type</Label>

                          <Select.Trigger className="h-9 rounded-xl border border-[#E6E6EE] bg-white px-3 text-[12px] capitalize">
                            <Select.Value />
                            <Select.Indicator />
                          </Select.Trigger>

                          <Select.Popover>
                            <ListBox>
                              {MEAL_TYPES.map((type) => (
                                <ListBox.Item
                                  key={type}
                                  id={type}
                                  textValue={type}
                                >
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

                          <Select.Trigger className="h-9 rounded-xl border border-[#E6E6EE] bg-white px-3 text-[12px]">
                            <Select.Value />
                            <Select.Indicator />
                          </Select.Trigger>

                          <Select.Popover>
                            <ListBox>
                              {systemMeals.map((meal) => (
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
                          className="h-9 rounded-xl bg-[#5E5EF4] px-4 text-[12px] font-semibold text-white hover:bg-[#4B4EE4] disabled:opacity-60"
                          isDisabled={!selectedMealId || saving || deleting}
                          onPress={addMeal}
                        >
                          {saving ? "Adding..." : "Add"}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[12px] text-[#72728A]">No details found.</p>
              )}
            </Card.Content>
          </>
        )}
      </Card>

      <Modal.Backdrop
        isOpen={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        variant="opaque"
      >
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="sm:max-w-[390px]">
            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading className="text-[18px] font-bold text-black">
                Delete Client Meal Plan
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body>
              <p className="text-[14px] text-[#72728A]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-black">
                  {headerPlanName}
                </span>
                ? This cannot be undone.
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                className="text-[12px] font-semibold"
                isDisabled={deleting}
                onPress={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>

              <Button
                variant="tertiary"
                className="bg-red-500 text-[12px] font-semibold text-white hover:bg-red-600"
                isDisabled={deleting}
                onPress={handleDeletePlan}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
