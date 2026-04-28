import type { Key } from "@heroui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Modal, Spinner, Tabs } from "@heroui/react";
import { X } from "lucide-react";

import {
  finishSession,
  getActiveSession,
  getSessionExercises,
} from "@/services/Sessions/sessionService";

import {
  getActivityLogs,
  getFullActivityLogs,
  logCardioActivity,
  logStrengthSet,
  updateCardioLog,
  updateStrengthSet,
} from "@/services/ActivityLog/activityLogService";

import type {
  ActiveSession,
  ActivityLogModalProps,
  CardioLog,
  EditingCardio,
  EditingStrength,
  SessionExercise,
  StrengthLog,
} from "@/utils/Interfaces/ActivityLog/activityLog";

import {
  numberOrNull,
  toInputValue,
} from "@/utils/ActivityLog/activityLogHelpers";

import ActivityLogMessage from "./ActivityLogMessage";
import ExerciseLogTab from "./ExerciseLogTab";
import CardioLogTab from "./CardioLogTab";
import PreviousLogsTab from "./PreviousLogsTab";

const ActivityLogModal = ({
  isOpen,
  onClose,
  sessionId,
  initialTab = "cardio",
  onFinished,
  onLogged,
}: ActivityLogModalProps) => {
  const [selectedTab, setSelectedTab] = useState<Key>(initialTab);

  const [activeSession, setActiveSession] = useState<ActiveSession | null>(
    null,
  );

  const [activeSessionId, setActiveSessionId] = useState<number | null>(
    sessionId || null,
  );

  const [exercises, setExercises] = useState<SessionExercise[]>([]);
  const [strengthLogs, setStrengthLogs] = useState<StrengthLog[]>([]);
  const [cardioLogs, setCardioLogs] = useState<CardioLog[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingStrength, setIsLoggingStrength] = useState(false);
  const [isLoggingCardio, setIsLoggingCardio] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [selectedExerciseId, setSelectedExerciseId] = useState<Key | null>(
    null,
  );
  const [isFullLogView, setIsFullLogView] = useState(false);

  const [setNumber, setSetNumber] = useState("1");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [rpe, setRpe] = useState("");

  const [steps, setSteps] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [calories, setCalories] = useState("");
  const [avgHr, setAvgHr] = useState("");

  const [editingStrength, setEditingStrength] =
    useState<EditingStrength | null>(null);

  const [editingCardio, setEditingCardio] = useState<EditingCardio | null>(
    null,
  );

  const [message, setMessage] = useState("");

  const selectedExercise = useMemo(() => {
    if (!selectedExerciseId) return null;

    return (
      exercises.find(
        (exercise) =>
          String(exercise.exerciseId) === String(selectedExerciseId),
      ) || null
    );
  }, [exercises, selectedExerciseId]);

  const loadLogs = useCallback(async (currentSessionId?: number | null) => {
    const logsData = await getActivityLogs(currentSessionId);

    setStrengthLogs(logsData.strengthLogs || []);
    setCardioLogs(logsData.cardioLogs || []);
  }, []);

  const loadModalData = useCallback(async () => {
    if (!isOpen) return;

    try {
      setIsLoading(true);
      setMessage("");
      setSelectedTab(initialTab);
      setEditingStrength(null);
      setEditingCardio(null);

      let currentSessionId = sessionId || null;
      let currentSession: ActiveSession | null = null;

      const activeData = await getActiveSession();

      if (activeData.session) {
        currentSession = activeData.session;
      }

      if (!currentSessionId && currentSession?.sessionId) {
        currentSessionId = currentSession.sessionId;
      }

      setActiveSession(currentSession);
      setActiveSessionId(currentSessionId);

      if (!currentSessionId) {
        setExercises([]);
        setSelectedExerciseId(null);

        await loadLogs(null);

        return;
      }

      const [exerciseData] = await Promise.all([
        getSessionExercises(currentSessionId),
        loadLogs(currentSessionId),
      ]);

      const sessionExercises = exerciseData.exercises || [];

      setExercises(sessionExercises);

      if (sessionExercises.length > 0) {
        setSelectedExerciseId(String(sessionExercises[0].exerciseId));
      }
    } catch (error) {
      console.error("Failed to load activity log data", error);
      setMessage("Could not load activity log data.");
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, initialTab, sessionId, loadLogs]);

  useEffect(() => {
    loadModalData();
  }, [loadModalData]);

  const resetStrengthForm = () => {
    setReps("");
    setWeight("");
    setRpe("");

    const nextSetNumber = Number(setNumber) + 1;
    setSetNumber(String(nextSetNumber));
  };

  const handleLogStrength = async () => {
    if (!activeSessionId) {
      setMessage("Please start a workout session before logging exercises.");
      return;
    }

    if (!selectedExerciseId) {
      setMessage("Select an exercise first.");
      return;
    }

    try {
      setIsLoggingStrength(true);
      setMessage("");

      await logStrengthSet({
        session_id: activeSessionId,
        exercise_id: Number(selectedExerciseId),
        set_number: Number(setNumber),
        reps: numberOrNull(reps),
        weight: numberOrNull(weight),
        rpe: numberOrNull(rpe),
      });

      await loadLogs(activeSessionId);
      onLogged?.();

      resetStrengthForm();
      setMessage("Set logged.");
    } catch (error: any) {
      console.error("Failed to log strength set", error);
      setMessage(
        error.response?.data?.message || "Could not log the strength set.",
      );
    } finally {
      setIsLoggingStrength(false);
    }
  };

  const handleLogCardio = async () => {
    try {
      setIsLoggingCardio(true);
      setMessage("");

      await logCardioActivity({
        session_id: activeSessionId,
        steps: numberOrNull(steps),
        distance_km: numberOrNull(distanceKm),
        duration_min: numberOrNull(durationMin),
        calories: numberOrNull(calories),
        avg_hr: numberOrNull(avgHr),
      });

      await loadLogs(activeSessionId);
      onLogged?.();

      setSteps("");
      setDistanceKm("");
      setDurationMin("");
      setCalories("");
      setAvgHr("");
      setMessage("Cardio logged.");
    } catch (error: any) {
      console.error("Failed to log cardio", error);
      setMessage(error.response?.data?.message || "Could not log cardio.");
    } finally {
      setIsLoggingCardio(false);
    }
  };

  const handleFinishSession = async () => {
    if (!activeSessionId) return;

    try {
      setIsFinishing(true);
      setMessage("");

      await finishSession(activeSessionId);

      onFinished?.();
      onLogged?.();
      onClose();
    } catch (error: any) {
      console.error("Failed to finish workout", error);
      setMessage(error.response?.data?.message || "Could not finish workout.");
    } finally {
      setIsFinishing(false);
    }
  };

  const startEditStrength = (log: StrengthLog) => {
    setEditingCardio(null);

    setEditingStrength({
      setLogId: log.setLogId,
      setNumber: String(log.setNumber),
      reps: toInputValue(log.reps),
      weight: toInputValue(log.weight),
      rpe: toInputValue(log.rpe),
    });
  };

  const startEditCardio = (log: CardioLog) => {
    setEditingStrength(null);

    setEditingCardio({
      cardioLogId: log.cardioLogId,
      steps: toInputValue(log.steps),
      distanceKm: toInputValue(log.distanceKm),
      durationMin: toInputValue(log.durationMin),
      calories: toInputValue(log.calories),
      avgHr: toInputValue(log.avgHr),
    });
  };

  const saveStrengthEdit = async () => {
    if (!editingStrength) return;

    try {
      setIsUpdating(true);
      setMessage("");

      await updateStrengthSet(editingStrength.setLogId, {
        set_number: Number(editingStrength.setNumber),
        reps: numberOrNull(editingStrength.reps),
        weight: numberOrNull(editingStrength.weight),
        rpe: numberOrNull(editingStrength.rpe),
      });

      await loadLogs(activeSessionId);
      setEditingStrength(null);
      setMessage("Strength log updated.");
    } catch (error: any) {
      console.error("Failed to update strength log", error);
      setMessage(
        error.response?.data?.message || "Could not update strength log.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const saveCardioEdit = async () => {
    if (!editingCardio) return;

    try {
      setIsUpdating(true);
      setMessage("");

      await updateCardioLog(editingCardio.cardioLogId, {
        steps: numberOrNull(editingCardio.steps),
        distance_km: numberOrNull(editingCardio.distanceKm),
        duration_min: numberOrNull(editingCardio.durationMin),
        calories: numberOrNull(editingCardio.calories),
        avg_hr: numberOrNull(editingCardio.avgHr),
      });

      await loadLogs(activeSessionId);
      setEditingCardio(null);
      setMessage("Cardio log updated.");
    } catch (error: any) {
      console.error("Failed to update cardio log", error);
      setMessage(
        error.response?.data?.message || "Could not update cardio log.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const loadFullLogs = async () => {
    try {
      setIsLoading(true);
      setMessage("");
      setEditingStrength(null);
      setEditingCardio(null);

      const logsData = await getFullActivityLogs();

      setStrengthLogs(logsData.strengthLogs || []);
      setCardioLogs(logsData.cardioLogs || []);
      setIsFullLogView(true);
      setSelectedTab("previous");
    } catch (error) {
      console.error("Failed to load full activity logs", error);
      setMessage("Could not load full activity logs.");
    } finally {
      setIsLoading(false);
    }
  };

  const backToTodayLogs = async () => {
    setIsFullLogView(false);
    await loadLogs(activeSessionId);
    setSelectedTab("previous");
  };

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        className="backdrop-blur-sm"
      >
        <Modal.Container>
          <Modal.Dialog className="max-h-[90vh] overflow-hidden p-0 sm:max-w-145">
            <Modal.Header className="border-b border-zinc-100 px-5 py-4">
              <div className="flex w-full items-start justify-between gap-4 px-5">
                <div>
                  <Modal.Heading className="text-lg font-semibold text-zinc-950">
                    Log Activity
                  </Modal.Heading>

                  <p className="mt-1 text-sm text-zinc-500">
                    Track exercises, cardio, and today&apos;s logs.
                  </p>
                </div>

                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  onPress={onClose}
                  className="text-zinc-500"
                >
                  <X size={16} />
                </Button>
              </div>
            </Modal.Header>

            <Modal.Body>
              <div className="max-h-[68vh] overflow-y-auto px-5">
                {isLoading ? (
                  <div className="flex min-h-28 items-center justify-center">
                    <Spinner size="sm" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ActivityLogMessage message={message} />

                    <Tabs
                      className="w-full"
                      selectedKey={selectedTab}
                      onSelectionChange={setSelectedTab}
                      variant="primary"
                    >
                      <Tabs.ListContainer>
                        <Tabs.List
                          aria-label="Activity log tabs"
                          className="flex w-fit gap-2 bg-transparent *:relative *:h-8 *:rounded-full *:px-4 *:text-sm *:font-semibold *:text-zinc-600 *:data-[selected=true]:text-indigo-700"
                        >
                          <Tabs.Tab id="strength">
                            Exercises
                            <Tabs.Indicator className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm" />
                          </Tabs.Tab>

                          <Tabs.Tab id="cardio">
                            Cardio
                            <Tabs.Indicator className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm" />
                          </Tabs.Tab>

                          <Tabs.Tab id="previous">
                            Logs
                            <Tabs.Indicator className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm" />
                          </Tabs.Tab>
                        </Tabs.List>
                      </Tabs.ListContainer>

                      <Tabs.Panel id="strength" className="px-4">
                        <ExerciseLogTab
                          activeSessionId={activeSessionId}
                          activeSession={activeSession}
                          exercises={exercises}
                          selectedExercise={selectedExercise}
                          selectedExerciseId={selectedExerciseId}
                          setSelectedExerciseId={setSelectedExerciseId}
                          setNumber={setNumber}
                          setSetNumber={setSetNumber}
                          reps={reps}
                          setReps={setReps}
                          weight={weight}
                          setWeight={setWeight}
                          rpe={rpe}
                          setRpe={setRpe}
                          isLoggingStrength={isLoggingStrength}
                          isFinishing={isFinishing}
                          onLogStrength={handleLogStrength}
                          onFinishSession={handleFinishSession}
                        />
                      </Tabs.Panel>

                      <Tabs.Panel id="cardio" className="px-4">
                        <CardioLogTab
                          steps={steps}
                          setSteps={setSteps}
                          distanceKm={distanceKm}
                          setDistanceKm={setDistanceKm}
                          durationMin={durationMin}
                          setDurationMin={setDurationMin}
                          calories={calories}
                          setCalories={setCalories}
                          avgHr={avgHr}
                          setAvgHr={setAvgHr}
                          isLoggingCardio={isLoggingCardio}
                          onLogCardio={handleLogCardio}
                        />
                      </Tabs.Panel>

                      <Tabs.Panel id="previous" className="px-4">
                        <PreviousLogsTab
                          strengthLogs={strengthLogs}
                          cardioLogs={cardioLogs}
                          editingStrength={editingStrength}
                          setEditingStrength={setEditingStrength}
                          editingCardio={editingCardio}
                          setEditingCardio={setEditingCardio}
                          isUpdating={isUpdating}
                          onStartEditStrength={startEditStrength}
                          onStartEditCardio={startEditCardio}
                          onSaveStrengthEdit={saveStrengthEdit}
                          onSaveCardioEdit={saveCardioEdit}
                          isFullLogView={isFullLogView}
                          onViewFullLog={loadFullLogs}
                          onBackToToday={backToTodayLogs}
                        />
                      </Tabs.Panel>
                    </Tabs>
                  </div>
                )}
              </div>
            </Modal.Body>

            <Modal.Footer className="border-t border-zinc-100 px-5 py-3">
              <Button
                variant="secondary"
                onPress={onClose}
                className="h-9 px-4 text-sm text-indigo-500"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default ActivityLogModal;
