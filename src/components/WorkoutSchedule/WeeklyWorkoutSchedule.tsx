import { type DragEvent, useMemo } from "react";

import AddSessionModal from "./AddSessionModal";
import ScheduleGrid from "./ScheduleGrid";
import ScheduleHeader from "./ScheduleHeader";
import ScheduleLegend from "./ScheduleLegend";
import type { WorkoutCalendarEvent } from "../../utils/Interfaces/WorkoutLog/workoutLog";
import useWorkoutSchedule, {
  toDateString,
} from "../../utils/WorkoutLog/useWorkoutSchedule";
import useWorkoutScheduleView from "../../utils/WorkoutLog/useWorkoutScheduleView";
import { ROW_HEIGHT } from "./constants";
import { useNavigate } from "react-router-dom";

interface WeeklyWorkoutScheduleProps {
  refreshToken?: number;
  onOpenWorkoutLog: (event?: WorkoutCalendarEvent | null) => void;
}

export default function WeeklyWorkoutSchedule({
  refreshToken = 0,
  onOpenWorkoutLog,
}: WeeklyWorkoutScheduleProps) {
  const {
    weekDays,
    weekStart,
    isAddSessionOpen,
    selectedDate,
    selectedStartTime,
    editingEvent,
    draggedEventId,
    setDraggedEventId,
    setEditingEvent,
    handleModalOpenChange,
    openAddSession,
    openEditSession,
    openAddSessionFromSelectedDate,
    goToPreviousWeek,
    goToNextWeek,
    jumpToNow,
  } = useWorkoutScheduleView();

  const weekStartString = toDateString(weekDays[0]);
  const weekEndString = toDateString(weekDays[6]);
  const navigate = useNavigate();

  const {
    events,
    activeEvent,
    activeSessionId,
    isLoading,
    errorMessage,
    addLocalEvent,
    updateLocalEvent,
    moveLocalEvent,
    removeLocalEvent,
    setEventActive,
  } = useWorkoutSchedule(refreshToken, weekStartString, weekEndString);

  const visibleEvents = useMemo(
    () =>
      events.filter(
        (event) => event.date >= weekStartString && event.date <= weekEndString,
      ),
    [events, weekEndString, weekStartString],
  );

  function handleOpenEditSession(event: WorkoutCalendarEvent) {
    if (event.source === "active-session") {
      onOpenWorkoutLog(activeEvent);
      return;
    }

    openEditSession(event);
  }

  function handleEventDragStart(
    event: DragEvent<HTMLElement>,
    workoutEvent: WorkoutCalendarEvent,
  ) {
    const isAttachedActive =
      activeSessionId != null &&
      workoutEvent.sessionId != null &&
      workoutEvent.sessionId === activeSessionId;

    if (workoutEvent.source === "active-session" || isAttachedActive) {
      return;
    }

    setDraggedEventId(workoutEvent.id);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", workoutEvent.id);
  }

  function handleEventDragEnd() {
    setDraggedEventId(null);
  }

  function handleDayColumnDrop(
    event: DragEvent<HTMLDivElement>,
    targetDate: string,
  ) {
    event.preventDefault();

    if (!draggedEventId) {
      return;
    }

    const targetEvent = visibleEvents.find(
      (workoutEvent) => workoutEvent.id === draggedEventId,
    );
    const isAttachedActive =
      activeSessionId != null &&
      targetEvent?.sessionId != null &&
      targetEvent.sessionId === activeSessionId;

    if (isAttachedActive) {
      setDraggedEventId(null);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetY = event.clientY - bounds.top;
    const targetHour = Math.max(
      0,
      Math.min(23, Math.floor(offsetY / ROW_HEIGHT)),
    );

    void moveLocalEvent(draggedEventId, targetDate, targetHour);
    setDraggedEventId(null);
  }

  function handleDayColumnDragOver(event: DragEvent<HTMLDivElement>) {
    if (!draggedEventId) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  async function handleSetActiveSession(event: WorkoutCalendarEvent) {
    await setEventActive(event.id);
  }

  function handleLogWorkoutFromEvent() {
    onOpenWorkoutLog(activeEvent);
  }

  return (
    <section
      className="rounded-3xl bg-white p-6 shadow-sm"
      style={{ border: "1px solid #5E5EF44D" }}
    >
      <ScheduleHeader
        weekStart={weekStart}
        weekEnd={weekDays[6]}
        activeEvent={activeEvent}
        onAddSession={openAddSessionFromSelectedDate}
        onLogWorkout={() => onOpenWorkoutLog(activeEvent)}
        onPreviousWeek={goToPreviousWeek}
        onNextWeek={goToNextWeek}
        onJumpToNow={jumpToNow}
        onCreateWorkout={() => {
          setTimeout(() => {
            navigate("/client/createWorkout");
          }, 0);
        }}
      />

      <ScheduleLegend />

      {errorMessage ? (
        <div
          className="mt-4 rounded-2xl px-4 py-3 text-[11.25px] text-[#72728A]"
          style={{
            border: "1px solid #5E5EF44D",
            backgroundColor: "#5E5EF414",
          }}
        >
          {errorMessage}
        </div>
      ) : null}

      <ScheduleGrid
        weekDays={weekDays}
        visibleEvents={visibleEvents}
        isLoading={isLoading}
        draggedEventId={draggedEventId}
        activeSessionId={activeSessionId}
        onOpenAddSession={openAddSession}
        onEditSession={handleOpenEditSession}
        onDeleteSession={removeLocalEvent}
        onSetActiveSession={handleSetActiveSession}
        onLogWorkout={handleLogWorkoutFromEvent}
        onEventDragStart={handleEventDragStart}
        onEventDragEnd={handleEventDragEnd}
        onDayColumnDrop={handleDayColumnDrop}
        onDayColumnDragOver={handleDayColumnDragOver}
      />

      <AddSessionModal
        isOpen={isAddSessionOpen}
        onOpenChange={(open) => {
          handleModalOpenChange(open);
          if (!open) {
            setEditingEvent(null);
          }
        }}
        defaultDate={selectedDate}
        defaultStartTime={selectedStartTime}
        editingEvent={editingEvent}
        onCreate={addLocalEvent}
        onUpdate={updateLocalEvent}
        onDelete={removeLocalEvent}
      />
    </section>
  );
}
