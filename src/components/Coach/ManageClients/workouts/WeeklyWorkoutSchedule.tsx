import { useEffect, useMemo, useState } from "react";

import type {
  CreateManageWorkoutEventInput,
  ManageWorkoutEvent,
  UpdateManageWorkoutEventInput,
} from "@/services/ManageClients/workout/getClients";

import {
  createManageWorkoutEvent,
  deleteManageWorkoutEvent,
  getManageWorkoutEvents,
  updateManageWorkoutEvent,
} from "@/services/ManageClients/workout/getClients";

import AddSessionModal from "./AddSessionModal";
import AssignWorkoutPlanModal from "./AssignWorkoutPlanModal";
import ManageWorkoutCalendar from "./ManageWorkoutCalendar";

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfWeek(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  nextDate.setDate(nextDate.getDate() - nextDate.getDay());

  return nextDate;
}

function endOfWeek(date: Date) {
  const nextDate = startOfWeek(date);
  nextDate.setDate(nextDate.getDate() + 6);

  return nextDate;
}

interface WeeklyWorkoutScheduleProps {
  contractId: number;
}

export default function WeeklyWorkoutSchedule({
  contractId,
}: WeeklyWorkoutScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<ManageWorkoutEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [isAssignPlanOpen, setIsAssignPlanOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));
  const [selectedStartTime, setSelectedStartTime] = useState("06:00");
  const [editingEvent, setEditingEvent] = useState<ManageWorkoutEvent | null>(
    null,
  );

  const rangeStart = useMemo(
    () => toDateString(startOfWeek(startOfMonth(currentDate))),
    [currentDate],
  );

  const rangeEnd = useMemo(
    () => toDateString(endOfWeek(endOfMonth(currentDate))),
    [currentDate],
  );

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const data = await getManageWorkoutEvents(
        contractId,
        rangeStart,
        rangeEnd,
      );

      setEvents(data);
    } catch (error) {
      console.error("Failed to load client workout events", error);
      setErrorMessage("Failed to load client workout events.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [contractId, rangeStart, rangeEnd]);

  function handleOpenAddSession(date: Date) {
    setEditingEvent(null);
    setSelectedDate(toDateString(date));
    setSelectedStartTime("06:00");
    setIsAddSessionOpen(true);
  }

  function handleOpenEditSession(event: ManageWorkoutEvent) {
    if (event.eventType !== "workout") {
      return;
    }

    setEditingEvent(event);
    setSelectedDate(event.date);
    setSelectedStartTime(event.startTime.slice(0, 5));
    setIsAddSessionOpen(true);
  }

  async function handleCreateSession(
    input: Omit<CreateManageWorkoutEventInput, "contract_id">,
  ) {
    const created = await createManageWorkoutEvent({
      contract_id: contractId,
      ...input,
    });

    setEvents((previous) => [...previous, created]);
  }

  async function handleUpdateSession(
    eventId: number,
    input: Omit<UpdateManageWorkoutEventInput, "contract_id" | "event_id">,
  ) {
    const updated = await updateManageWorkoutEvent({
      contract_id: contractId,
      event_id: eventId,
      ...input,
    });

    setEvents((previous) =>
      previous.map((event) => (event.eventId === eventId ? updated : event)),
    );
  }

  async function handleDeleteSession(eventId: number) {
    await deleteManageWorkoutEvent(contractId, eventId);

    setEvents((previous) =>
      previous.filter((event) => event.eventId !== eventId),
    );
  }

  async function handleMoveEventToDate(eventId: number, nextDate: string) {
    const event = events.find((item) => item.eventId === eventId);

    if (!event || event.eventType !== "workout") {
      return;
    }

    if (!event.workoutPlanId || !event.workoutDayId) {
      return;
    }

    await handleUpdateSession(eventId, {
      event_date: nextDate,
      start_time: event.startTime,
      end_time: event.endTime,
      description: event.description || event.title || "Workout Session",
      notes: event.notes || "",
      workout_plan_id: event.workoutPlanId,
      workout_day_id: event.workoutDayId,
    });
  }

  return (
    <>
      {errorMessage ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 font-primary text-[12px] text-[#72728A]">
          {errorMessage}
        </div>
      ) : null}

      <ManageWorkoutCalendar
        currentDate={currentDate}
        events={events}
        isLoading={isLoading}
        onCurrentDateChange={setCurrentDate}
        onAddSession={handleOpenAddSession}
        onAssignPlan={() => setIsAssignPlanOpen(true)}
        onEditSession={handleOpenEditSession}
        onMoveEventToDate={handleMoveEventToDate}
      />

      <AddSessionModal
        contractId={contractId}
        isOpen={isAddSessionOpen}
        onOpenChange={(open) => {
          setIsAddSessionOpen(open);

          if (!open) {
            setEditingEvent(null);
          }
        }}
        defaultDate={selectedDate}
        defaultStartTime={selectedStartTime}
        editingEvent={editingEvent}
        onCreate={handleCreateSession}
        onUpdate={handleUpdateSession}
        onDelete={handleDeleteSession}
      />

      <AssignWorkoutPlanModal
        contractId={contractId}
        isOpen={isAssignPlanOpen}
        onOpenChange={setIsAssignPlanOpen}
        onAssigned={loadEvents}
      />
    </>
  );
}
