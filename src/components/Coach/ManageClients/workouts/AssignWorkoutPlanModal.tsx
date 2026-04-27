import {
  Button,
  Modal,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "@heroui/react";
import { CheckCircle2, Dumbbell } from "lucide-react";
import { useEffect, useState } from "react";

import type { ManageWorkoutPlan } from "@/services/ManageClients/workout/getClients";

import {
  assignWorkoutPlanToClient,
  getManageCoachWorkoutPlans,
  getManageSystemWorkoutPlans,
} from "@/services/ManageClients/workout/getClients";

interface AssignWorkoutPlanModalProps {
  contractId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAssigned: () => void | Promise<void>;
}

type PlanTab = "coach" | "system";

export default function AssignWorkoutPlanModal({
  contractId,
  isOpen,
  onOpenChange,
  onAssigned,
}: AssignWorkoutPlanModalProps) {
  const [activeTab, setActiveTab] = useState<PlanTab>("coach");

  const [coachPlans, setCoachPlans] = useState<ManageWorkoutPlan[]>([]);
  const [systemPlans, setSystemPlans] = useState<ManageWorkoutPlan[]>([]);

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [isLoadingCoachPlans, setIsLoadingCoachPlans] = useState(false);
  const [isLoadingSystemPlans, setIsLoadingSystemPlans] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [message, setMessage] = useState("");

  const plans = activeTab === "coach" ? coachPlans : systemPlans;
  const isLoading =
    activeTab === "coach" ? isLoadingCoachPlans : isLoadingSystemPlans;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setActiveTab("coach");
    setSelectedPlanId(null);
    setMessage("");

    async function loadPlans() {
      try {
        setIsLoadingCoachPlans(true);
        setIsLoadingSystemPlans(true);

        const [coachData, systemData] = await Promise.all([
          getManageCoachWorkoutPlans(),
          getManageSystemWorkoutPlans(),
        ]);

        setCoachPlans(coachData);
        setSystemPlans(systemData);
      } catch (error) {
        console.error("Failed to load workout plans", error);
        setCoachPlans([]);
        setSystemPlans([]);
        setMessage("Failed to load workout plans.");
      } finally {
        setIsLoadingCoachPlans(false);
        setIsLoadingSystemPlans(false);
      }
    }

    loadPlans();
  }, [isOpen]);

  function handleTabChange(value: React.Key) {
    setActiveTab(value as PlanTab);
    setSelectedPlanId(null);
    setMessage("");
  }

  async function handleAssign() {
    if (!selectedPlanId || isAssigning) {
      return;
    }

    try {
      setIsAssigning(true);
      setMessage("");

      const result = await assignWorkoutPlanToClient(
        contractId,
        selectedPlanId,
        activeTab === "coach"
          ? "Assigned by coach"
          : "Assigned from recommended workout plans",
      );

      setMessage(result?.message || "Workout plan assigned.");

      await onAssigned();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to assign workout plan", error);
      setMessage("Failed to assign workout plan.");
    } finally {
      setIsAssigning(false);
    }
  }

  function renderPlans(planList: ManageWorkoutPlan[], loading: boolean) {
    if (loading) {
      return (
        <div className="flex min-h-[360px] items-center justify-center">
          <Spinner />
        </div>
      );
    }

    if (planList.length === 0) {
      return (
        <div className="min-h-[360px] rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-4">
          <p className="font-primary text-[14px] font-semibold text-[#0F0F14]">
            No workout plans found
          </p>

          <p className="mt-1 font-primary text-[12px] leading-5 text-[#72728A]">
            {activeTab === "coach"
              ? "Create a workout plan first, then come back here to assign it to the client."
              : "No recommended workout plans are available right now."}
          </p>
        </div>
      );
    }

    return (
      <div className="min-h-[360px] max-h-[360px] space-y-2 overflow-y-auto pr-1">
        {planList.map((plan) => {
          const isSelected = selectedPlanId === plan.plan_id;

          return (
            <button
              key={plan.plan_id}
              type="button"
              onClick={() => setSelectedPlanId(plan.plan_id)}
              className={`flex w-full items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                isSelected
                  ? "border-indigo-200 bg-indigo-50"
                  : "border-[#E5E7EB] bg-white hover:bg-[#F8FAFC]"
              }`}
            >
              <div className="flex min-w-0 gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <Dumbbell className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-primary text-[14px] font-semibold text-[#0F0F14]">
                    {plan.plan_name}
                  </p>

                  <p className="mt-1 font-primary text-[12px] text-[#72728A]">
                    {plan.source} • {plan.total_exercises} exercises
                  </p>

                  {plan.description ? (
                    <p className="mt-1 line-clamp-2 font-primary text-[12px] leading-5 text-[#72728A]">
                      {plan.description}
                    </p>
                  ) : null}
                </div>
              </div>

              {isSelected ? (
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-indigo-500" />
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        variant="blur"
        className="bg-black/30"
      >
        <Modal.Container placement="center" size="lg">
          <Modal.Dialog
            aria-label="Assign workout plan"
            className="w-full rounded-4xl border border-[#E5E7EB] bg-white shadow-xl"
          >
            <Modal.Header className="border-b border-[#E5E7EB] bg-white py-3">
              <div>
                <p className="font-primary text-[12px] font-medium text-indigo-500">
                  Assign Workout Plan
                </p>

                <Modal.Heading className="mt-1 font-primary text-[16px] font-semibold text-[#0F0F14]">
                  Choose a Plan
                </Modal.Heading>

                <p className="mt-1 font-primary text-[12px] leading-5 text-[#72728A]">
                  Assign one of your plans or a recommended system plan to this
                  client. Once assigned, it can be scheduled on the calendar.
                </p>
              </div>
            </Modal.Header>

            <Modal.Body className="bg-white px-4 py-3">
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={handleTabChange}
                className="w-full"
              >
                <TabList className="mb-4 gap-2 bg-transparent p-0">
                  <Tab
                    id="coach"
                    className="rounded-xl border border-[#E5E7EB] bg-transparent px-4 py-2 font-primary text-[12px] font-semibold text-[#72728A] data-[selected=true]:border-indigo-200 data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-600"
                  >
                    Coach Plans
                  </Tab>

                  <Tab
                    id="system"
                    className="rounded-xl border border-[#E5E7EB] bg-transparent px-4 py-2 font-primary text-[12px] font-semibold text-[#72728A] data-[selected=true]:border-indigo-200 data-[selected=true]:bg-indigo-50 data-[selected=true]:text-indigo-600"
                  >
                    Recommended Plans
                  </Tab>
                </TabList>

                <TabPanel id="coach">
                  {renderPlans(coachPlans, isLoadingCoachPlans)}
                </TabPanel>

                <TabPanel id="system">
                  {renderPlans(systemPlans, isLoadingSystemPlans)}
                </TabPanel>
              </Tabs>

              {message ? (
                <p className="mt-3 font-primary text-[12px] text-[#72728A]">
                  {message}
                </p>
              ) : null}
            </Modal.Body>

            <Modal.Footer className="border-t border-[#E5E7EB] bg-white pb-1 pt-3">
              <div className="flex w-full justify-end gap-2">
                <Button
                  variant="outline"
                  onPress={() => onOpenChange(false)}
                  isDisabled={isAssigning}
                  className="h-9 rounded-xl border border-[#E5E7EB] bg-white px-4 font-primary text-[12px] font-semibold text-[#0F0F14]"
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  onPress={handleAssign}
                  isDisabled={!selectedPlanId || isAssigning || isLoading}
                  className="h-9 rounded-xl border-0 bg-indigo-500 px-4 font-primary text-[12px] font-semibold text-white hover:bg-indigo-600"
                >
                  Assign Plan
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
