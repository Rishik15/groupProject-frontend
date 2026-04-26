import { useEffect, useMemo, useState } from "react";

import type {
  CalendarEvent,
  CreateWorkoutEventInput,
  UpdateWorkoutEventInput,
} from "../../utils/Interfaces/Calendar/calendar";

import {
  createWorkoutEvent,
  deleteWorkoutEvent,
  getCalendarEvents,
  updateWorkoutEvent,
} from "../../services/Calendar/calendarEventService";

import AddSessionModal from "./AddSessionModal";
import CossWorkoutCalendar from "./CossWorkoutCalendar";

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

export default function WeeklyWorkoutSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));
  const [selectedStartTime, setSelectedStartTime] = useState("06:00");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const rangeStart = useMemo(
    () => toDateString(startOfWeek(startOfMonth(currentDate))),
    [currentDate],
  );

  const rangeEnd = useMemo(
    () => toDateString(endOfWeek(endOfMonth(currentDate))),
    [currentDate],
  );

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getCalendarEvents(rangeStart, rangeEnd);
        setEvents(data);
      } catch (error) {
        console.error("Failed to load calendar events", error);
        setErrorMessage("Failed to load calendar events.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, [rangeStart, rangeEnd]);

  function handleOpenAddSession(date: Date) {
    setEditingEvent(null);
    setSelectedDate(toDateString(date));
    setSelectedStartTime("06:00");
    setIsAddSessionOpen(true);
  }

  function handleOpenEditSession(event: CalendarEvent) {
    if (event.eventType !== "workout") {
      return;
    }

    setEditingEvent(event);
    setSelectedDate(event.date);
    setSelectedStartTime(event.startTime.slice(0, 5));
    setIsAddSessionOpen(true);
  }

  async function handleCreateSession(input: CreateWorkoutEventInput) {
    const created = await createWorkoutEvent(input);
    setEvents((previous) => [...previous, created]);
  }

  async function handleUpdateSession(
    eventId: number,
    input: UpdateWorkoutEventInput,
  ) {
    const updated = await updateWorkoutEvent(eventId, input);

    setEvents((previous) =>
      previous.map((event) => (event.eventId === eventId ? updated : event)),
    );
  }

  async function handleDeleteSession(eventId: number) {
    await deleteWorkoutEvent(eventId);

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
      description: event.description || "",
      workout_plan_id: event.workoutPlanId,
      workout_day_id: event.workoutDayId,
    });
  }

  return (
    <>
      {errorMessage ? (
        <div
          className="mb-4 rounded-2xl px-4 py-3 text-[11.25px] text-[#72728A]"
          style={{
            border: "1px solid #E5E7EB",
            backgroundColor: "#F8FAFC",
          }}
        >
          {errorMessage}
        </div>
      ) : null}

      <CossWorkoutCalendar
        currentDate={currentDate}
        events={events}
        isLoading={isLoading}
        onCurrentDateChange={setCurrentDate}
        onAddSession={handleOpenAddSession}
        onEditSession={handleOpenEditSession}
        onMoveEventToDate={handleMoveEventToDate}
      />

      <AddSessionModal
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
    </>
  );
}