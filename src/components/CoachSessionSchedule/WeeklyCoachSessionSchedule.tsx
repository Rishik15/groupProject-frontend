import { useEffect, useMemo, useState } from "react";

import type {
  CalendarEvent,
  CreateCoachSessionEventInput,
  UpdateCoachSessionEventInput,
} from "@/utils/Interfaces/Calendar/calendar";

import {
  createCoachSessionEvent,
  deleteCoachSessionEvent,
  getCoachSessionEvents,
  updateCoachSessionEvent,
  updateCoachSessionStatus,
} from "@/services/CoachSession/coachSessionService";

import type { CoachSessionClient } from "../../utils/Interfaces/CoachSession/coachSession";
import CoachSessionCalendar from "./CoachSessionCalendar";
import CoachSessionModal from "./CoachSessionModal";

interface WeeklyCoachSessionScheduleProps {
  clients: CoachSessionClient[];
}

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

export default function WeeklyCoachSessionSchedule({
  clients,
}: WeeklyCoachSessionScheduleProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));
  const [selectedStartTime, setSelectedStartTime] = useState("09:00");
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

        const data = await getCoachSessionEvents(rangeStart, rangeEnd);
        setEvents(data);
      } catch (error) {
        console.error("Failed to load coach sessions", error);
        setErrorMessage("Failed to load coach sessions.");
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, [rangeStart, rangeEnd]);

  function handleOpenAddSession(date: Date) {
    setEditingEvent(null);
    setSelectedDate(toDateString(date));
    setSelectedStartTime(
      `${String(date.getHours()).padStart(2, "0")}:${String(
        date.getMinutes(),
      ).padStart(2, "0")}`,
    );
    setIsModalOpen(true);
  }

  function handleOpenEditSession(event: CalendarEvent) {
    if (event.eventType !== "coach_session") return;

    setEditingEvent(event);
    setSelectedDate(event.date);
    setSelectedStartTime(event.startTime.slice(0, 5));
    setIsModalOpen(true);
  }

  async function handleCreateSession(input: CreateCoachSessionEventInput) {
    const created = await createCoachSessionEvent(input);
    setEvents((previous) => [...previous, created]);
  }

  async function handleUpdateSession(
    eventId: number,
    input: UpdateCoachSessionEventInput,
  ) {
    const updated = await updateCoachSessionEvent(eventId, input);

    setEvents((previous) =>
      previous.map((event) => (event.eventId === eventId ? updated : event)),
    );
  }

  async function handleDeleteSession(eventId: number) {
    await deleteCoachSessionEvent(eventId);

    setEvents((previous) =>
      previous.filter((event) => event.eventId !== eventId),
    );
  }

  async function handleMoveEventToDate(eventId: number, nextDate: string) {
    const event = events.find((item) => item.eventId === eventId);

    if (!event || event.eventType !== "coach_session") return;

    await handleUpdateSession(eventId, {
      event_date: nextDate,
      start_time: event.startTime,
      end_time: event.endTime,
      description: event.description || "Coach Session",
      notes: event.notes || "",
    });
  }

  async function handleStatusChange(
    eventId: number,
    status: "scheduled" | "completed" | "cancelled",
  ) {
    const updated = await updateCoachSessionStatus(eventId, status);

    setEvents((previous) =>
      previous.map((event) => (event.eventId === eventId ? updated : event)),
    );
  }

  return (
    <>
      {errorMessage ? (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-500">
          {errorMessage}
        </div>
      ) : null}

      <CoachSessionCalendar
        currentDate={currentDate}
        events={events}
        isLoading={isLoading}
        clientsCount={clients.length}
        onCurrentDateChange={setCurrentDate}
        onAddSession={handleOpenAddSession}
        onEditSession={handleOpenEditSession}
        onMoveEventToDate={handleMoveEventToDate}
      />

      <CoachSessionModal
        isOpen={isModalOpen}
        clients={clients}
        onOpenChange={(open) => {
          setIsModalOpen(open);

          if (!open) setEditingEvent(null);
        }}
        defaultDate={selectedDate}
        defaultStartTime={selectedStartTime}
        editingEvent={editingEvent}
        onCreate={handleCreateSession}
        onUpdate={handleUpdateSession}
        onDelete={handleDeleteSession}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
