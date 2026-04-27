import { Button, Card, Input, Label } from "@heroui/react";

import type {
  CardioLog,
  EditingCardio,
  EditingStrength,
  StrengthLog,
} from "@/utils/Interfaces/ActivityLog/activityLog";

interface PreviousLogsTabProps {
  strengthLogs: StrengthLog[];
  cardioLogs: CardioLog[];

  editingStrength: EditingStrength | null;
  setEditingStrength: (value: EditingStrength | null) => void;

  editingCardio: EditingCardio | null;
  setEditingCardio: (value: EditingCardio | null) => void;

  isUpdating: boolean;

  onStartEditStrength: (log: StrengthLog) => void;
  onStartEditCardio: (log: CardioLog) => void;

  onSaveStrengthEdit: () => void;
  onSaveCardioEdit: () => void;

  isFullLogView?: boolean;
  onViewFullLog?: () => void;
  onBackToToday?: () => void;
}

const formatDate = (value?: string | null) => {
  if (!value) return "";

  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const PreviousLogsTab = ({
  strengthLogs,
  cardioLogs,
  editingStrength,
  setEditingStrength,
  editingCardio,
  setEditingCardio,
  isUpdating,
  onStartEditStrength,
  onStartEditCardio,
  onSaveStrengthEdit,
  onSaveCardioEdit,
  isFullLogView = false,
  onViewFullLog,
  onBackToToday,
}: PreviousLogsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-zinc-950">
            {isFullLogView ? "Full Activity Log" : "Today's Logs"}
          </p>
          <p className="text-[12px] text-zinc-500">
            {isFullLogView
              ? "All previous workout and cardio logs."
              : "Today's logs can be edited."}
          </p>
        </div>

        {isFullLogView ? (
          <Button
            size="sm"
            variant="secondary"
            className="h-8 text-sm"
            onPress={onBackToToday}
          >
            Back
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="h-8 text-sm"
            onPress={onViewFullLog}
          >
            View Full Log
          </Button>
        )}
      </div>

      <div>
        <p className="mb-2 text-base font-semibold text-zinc-950">
          Exercise Sets
        </p>

        {strengthLogs.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {isFullLogView
              ? "No workout sets logged yet."
              : "No finished workout sets logged today."}
          </p>
        ) : (
          <div className="space-y-2">
            {strengthLogs.map((log) => (
              <Card
                key={log.setLogId}
                className="rounded-2xl border border-zinc-100 bg-white shadow-sm"
              >
                <Card.Content className="p-3">
                  {!isFullLogView &&
                  log.canEdit &&
                  editingStrength?.setLogId === log.setLogId ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-zinc-950">
                        {log.exerciseName}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-1">
                          <Label>Set</Label>
                          <Input
                            type="number"
                            value={editingStrength.setNumber}
                            onChange={(event) =>
                              setEditingStrength({
                                ...editingStrength,
                                setNumber: event.target.value,
                              })
                            }
                            variant="secondary"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label>Reps</Label>
                          <Input
                            type="number"
                            value={editingStrength.reps}
                            onChange={(event) =>
                              setEditingStrength({
                                ...editingStrength,
                                reps: event.target.value,
                              })
                            }
                            variant="secondary"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label>Weight</Label>
                          <Input
                            type="number"
                            value={editingStrength.weight}
                            onChange={(event) =>
                              setEditingStrength({
                                ...editingStrength,
                                weight: event.target.value,
                              })
                            }
                            variant="secondary"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label>RPE</Label>
                          <Input
                            type="number"
                            value={editingStrength.rpe}
                            onChange={(event) =>
                              setEditingStrength({
                                ...editingStrength,
                                rpe: event.target.value,
                              })
                            }
                            variant="secondary"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-indigo-600 text-white"
                          isPending={isUpdating}
                          onPress={onSaveStrengthEdit}
                        >
                          Save
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onPress={() => setEditingStrength(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-950">
                          {log.exerciseName}
                        </p>

                        <p className="text-xs text-zinc-500">
                          Set {log.setNumber}
                          {" • "}
                          {log.reps ?? "-"} reps
                          {" • "}
                          {log.weight ?? "-"} lbs
                          {" • "}
                          RPE {log.rpe ?? "-"}
                        </p>

                        {isFullLogView ? (
                          <p className="mt-1 text-xs text-zinc-400">
                            {log.workoutPlanName || "Workout Plan"}
                            {log.workoutDayLabel
                              ? ` • ${log.workoutDayLabel}`
                              : ""}
                            {log.performedAt
                              ? ` • ${formatDate(log.performedAt)}`
                              : ""}
                          </p>
                        ) : null}
                      </div>

                      {!isFullLogView && log.canEdit ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onPress={() => onStartEditStrength(log)}
                        >
                          Edit
                        </Button>
                      ) : null}
                    </div>
                  )}
                </Card.Content>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-base font-semibold text-zinc-950">Cardio</p>

        {cardioLogs.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {isFullLogView ? "No cardio logs yet." : "No cardio logged today."}
          </p>
        ) : (
          <div className="space-y-2">
            {cardioLogs.map((log) => (
              <Card
                key={log.cardioLogId}
                className="rounded-2xl border border-zinc-100 bg-white shadow-sm"
              >
                <Card.Content className="p-3">
                  {!isFullLogView &&
                  log.canEdit &&
                  editingCardio?.cardioLogId === log.cardioLogId ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-1">
                          <Label>Steps</Label>
                          <Input
                            type="number"
                            value={editingCardio.steps}
                            onChange={(event) =>
                              setEditingCardio({
                                ...editingCardio,
                                steps: event.target.value,
                              })
                            }
                            variant="secondary"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label>Distance km</Label>
                          <Input
                            type="number"
                            value={editingCardio.distanceKm}
                            onChange={(event) =>
                              setEditingCardio({
                                ...editingCardio,
                                distanceKm: event.target.value,
                              })
                            }
                            variant="secondary"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label>Duration min</Label>
                          <Input
                            type="number"
                            value={editingCardio.durationMin}
                            onChange={(event) =>
                              setEditingCardio({
                                ...editingCardio,
                                durationMin: event.target.value,
                              })
                            }
                            variant="secondary"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label>Calories</Label>
                          <Input
                            type="number"
                            value={editingCardio.calories}
                            onChange={(event) =>
                              setEditingCardio({
                                ...editingCardio,
                                calories: event.target.value,
                              })
                            }
                            variant="secondary"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <Label>Avg HR</Label>
                          <Input
                            type="number"
                            value={editingCardio.avgHr}
                            onChange={(event) =>
                              setEditingCardio({
                                ...editingCardio,
                                avgHr: event.target.value,
                              })
                            }
                            variant="secondary"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-indigo-600 text-white"
                          isPending={isUpdating}
                          onPress={onSaveCardioEdit}
                        >
                          Save
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onPress={() => setEditingCardio(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-zinc-950">
                          Cardio activity
                        </p>

                        <p className="text-xs text-zinc-500">
                          {log.steps ?? "-"} steps
                          {" • "}
                          {log.distanceKm ?? "-"} km
                          {" • "}
                          {log.durationMin ?? "-"} min
                          {" • "}
                          {log.calories ?? "-"} cal
                          {" • "}
                          HR {log.avgHr ?? "-"}
                        </p>

                        {isFullLogView && log.performedAt ? (
                          <p className="mt-1 text-xs text-zinc-400">
                            {formatDate(log.performedAt)}
                          </p>
                        ) : null}
                      </div>

                      {!isFullLogView && log.canEdit ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onPress={() => onStartEditCardio(log)}
                        >
                          Edit
                        </Button>
                      ) : null}
                    </div>
                  )}
                </Card.Content>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousLogsTab;
