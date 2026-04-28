import { useEffect, useState } from "react";
import { Button, Input, Modal, Spinner } from "@heroui/react";
import { Target } from "lucide-react";

import {
  getManagedNutritionGoals,
  saveManagedNutritionGoals,
} from "@/services/ManageClients/nutrition/getNutrition";

interface NutritionGoalsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  contractId: number;
  onSaved?: () => void;
}

interface GoalForm {
  calories_target: string;
  protein_target: string;
  carbs_target: string;
  fat_target: string;
}

const NutritionGoalsModal = ({
  isOpen,
  onOpenChange,
  contractId,
  onSaved,
}: NutritionGoalsModalProps) => {
  const [form, setForm] = useState<GoalForm>({
    calories_target: "",
    protein_target: "",
    carbs_target: "",
    fat_target: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadGoals = async () => {
    if (!contractId) return;

    try {
      setLoading(true);
      setError("");

      const goals = await getManagedNutritionGoals(contractId);

      if (goals) {
        setForm({
          calories_target: goals.calories_target?.toString() || "",
          protein_target: goals.protein_target?.toString() || "",
          carbs_target: goals.carbs_target?.toString() || "",
          fat_target: goals.fat_target?.toString() || "",
        });
      } else {
        setForm({
          calories_target: "",
          protein_target: "",
          carbs_target: "",
          fat_target: "",
        });
      }
    } catch (err) {
      console.error("Failed to load managed nutrition goals:", err);
      setError("Could not load this client's current goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadGoals();
    }
  }, [isOpen, contractId]);

  const updateField = (field: keyof GoalForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const parseGoal = (value: string) => {
    if (!value.trim()) {
      return null;
    }

    return Number(value);
  };

  const handleSave = async (close: () => void) => {
    const calories = parseGoal(form.calories_target);
    const protein = parseGoal(form.protein_target);
    const carbs = parseGoal(form.carbs_target);
    const fat = parseGoal(form.fat_target);

    if (
      calories === null &&
      protein === null &&
      carbs === null &&
      fat === null
    ) {
      setError("Enter at least one goal.");
      return;
    }

    if (
      Number.isNaN(calories) ||
      Number.isNaN(protein) ||
      Number.isNaN(carbs) ||
      Number.isNaN(fat)
    ) {
      setError("Goals must be valid numbers.");
      return;
    }

    if (
      (calories !== null && calories < 0) ||
      (protein !== null && protein < 0) ||
      (carbs !== null && carbs < 0) ||
      (fat !== null && fat < 0)
    ) {
      setError("Goals cannot be negative.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await saveManagedNutritionGoals(contractId, {
        calories_target: calories,
        protein_target: protein,
        carbs_target: carbs,
        fat_target: fat,
      });

      onSaved?.();
      window.dispatchEvent(new Event("managedNutritionGoalsUpdated"));

      close();
    } catch (err) {
      console.error("Failed to save managed nutrition goals:", err);
      setError("Could not save goals. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal.Backdrop isOpen={isOpen} variant="blur" onOpenChange={onOpenChange}>
      <Modal.Container placement="center" size="lg" scroll="inside">
        <Modal.Dialog className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-xl">
          {({ close }) => (
            <>
              <Modal.CloseTrigger />

              <Modal.Header className="border-b border-neutral-100 px-4 py-2">
                <div className="flex items-center gap-3">
                  <Modal.Icon className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-[#5E5EF4]">
                    <Target className="h-5 w-5" />
                  </Modal.Icon>

                  <div>
                    <Modal.Heading className="text-lg font-semibold text-[#0F0F14]">
                      Set Client Nutrition Goals
                    </Modal.Heading>
                    <p className="mt-1 text-sm leading-5 text-[#72728A]">
                      Add this client&apos;s daily calorie and macro targets.
                    </p>
                  </div>
                </div>
              </Modal.Header>

              <Modal.Body className="px-4 py-3">
                {loading ? (
                  <div className="flex min-h-45 items-center justify-center">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="managed_calories_target"
                          className="text-sm font-medium text-[#0F0F14]"
                        >
                          Calories
                        </label>

                        <div className="relative">
                          <Input
                            id="managed_calories_target"
                            name="calories_target"
                            type="number"
                            min={0}
                            placeholder="2200"
                            value={form.calories_target}
                            disabled={saving}
                            className="w-full pr-12"
                            onChange={(e) =>
                              updateField("calories_target", e.target.value)
                            }
                          />

                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                            kcal
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="managed_protein_target"
                          className="text-sm font-medium text-[#0F0F14]"
                        >
                          Protein
                        </label>

                        <div className="relative">
                          <Input
                            id="managed_protein_target"
                            name="protein_target"
                            type="number"
                            min={0}
                            placeholder="160"
                            value={form.protein_target}
                            disabled={saving}
                            className="w-full pr-10"
                            onChange={(e) =>
                              updateField("protein_target", e.target.value)
                            }
                          />

                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                            g
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="managed_carbs_target"
                          className="text-sm font-medium text-[#0F0F14]"
                        >
                          Carbs
                        </label>

                        <div className="relative">
                          <Input
                            id="managed_carbs_target"
                            name="carbs_target"
                            type="number"
                            min={0}
                            placeholder="240"
                            value={form.carbs_target}
                            disabled={saving}
                            className="w-full pr-10"
                            onChange={(e) =>
                              updateField("carbs_target", e.target.value)
                            }
                          />

                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                            g
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="managed_fat_target"
                          className="text-sm font-medium text-[#0F0F14]"
                        >
                          Fat
                        </label>

                        <div className="relative">
                          <Input
                            id="managed_fat_target"
                            name="fat_target"
                            type="number"
                            min={0}
                            placeholder="70"
                            value={form.fat_target}
                            disabled={saving}
                            className="w-full pr-10"
                            onChange={(e) =>
                              updateField("fat_target", e.target.value)
                            }
                          />

                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                            g
                          </span>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                      </div>
                    )}
                  </div>
                )}
              </Modal.Body>

              <Modal.Footer className="border-t border-neutral-100 px-4 pt-3">
                <Button variant="secondary" isDisabled={saving} onPress={close}>
                  Cancel
                </Button>

                <Button
                  className="bg-[#5E5EF4] text-white"
                  isPending={saving}
                  onPress={() => handleSave(close)}
                >
                  {({ isPending }) => (
                    <>
                      {isPending && <Spinner color="current" size="sm" />}
                      {isPending ? "Saving..." : "Save Goals"}
                    </>
                  )}
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};

export default NutritionGoalsModal;