import { Button } from "@heroui/react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardPlus,
  Dumbbell,
  Plus,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import type { CalendarEvent as AppCalendarEvent } from "../../utils/Interfaces/Calendar/calendar";
import { CalendarDndProvider } from "../event-calendar/calendar-dnd-context";
import { MonthView } from "../event-calendar/month-view";
import type { CalendarEvent } from "../event-calendar/types";

type CalendarEventWithDrag = CalendarEvent & {
  isDraggable?: boolean;
  className?: string;
};

interface CossWorkoutCalendarProps {
  currentDate: Date;
  events: AppCalendarEvent[];
  isLoading?: boolean;
  onCurrentDateChange: (date: Date) => void;
  onAddSession: (date: Date) => void;
  onEditSession: (event: AppCalendarEvent) => void;
  onMoveEventToDate: (
    eventId: number,
    nextDate: string,
  ) => void | Promise<void>;
}

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function addMonths(date: Date, months: number) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getWorkoutEventColor(event: AppCalendarEvent) {
  if (event.eventType === "coach_session") {
    return "sky";
  }

  if (event.workoutStatus === "completed") {
    return "emerald";
  }

  if (event.workoutStatus === "missed") {
    return "rose";
  }

  if (event.workoutStatus === "active") {
    return "amber";
  }

  return "violet";
}

function getWorkoutEventTitle(event: AppCalendarEvent) {
  const time = event.startTime ? event.startTime.slice(0, 5) : "";
  const title = time ? `${time} ${event.title}` : event.title;

  if (event.workoutStatus === "completed") {
    return `${title}`;
  }

  if (event.workoutStatus === "missed") {
    return `Missed: ${title}`;
  }

  if (event.workoutStatus === "active") {
    return `Active: ${title}`;
  }

  return title;
}

function getWorkoutEventClassName(event: AppCalendarEvent) {
  if (event.workoutStatus === "completed") {
    return "coss-event-completed";
  }

  if (event.workoutStatus === "missed") {
    return "coss-event-missed";
  }

  if (event.workoutStatus === "active") {
    return "coss-event-active";
  }

  return "";
}

function toCalendarEvent(event: AppCalendarEvent): CalendarEventWithDrag {
  return {
    id: event.id,
    title: getWorkoutEventTitle(event),
    description: event.description || undefined,
    start: toDateTime(event.date, event.startTime),
    end: toDateTime(event.date, event.endTime),
    color: getWorkoutEventColor(event),
    isDraggable:
      event.eventType === "workout" &&
      event.workoutStatus !== "completed" &&
      event.workoutStatus !== "active",
    className: getWorkoutEventClassName(event),
  };
}

function withDefaultStartTime(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(6, 0, 0, 0);
  return nextDate;
}

export default function CossWorkoutCalendar({
  currentDate,
  events,
  isLoading = false,
  onCurrentDateChange,
  onAddSession,
  onEditSession,
  onMoveEventToDate,
}: CossWorkoutCalendarProps) {
  const navigate = useNavigate();

  const eventMap = useMemo(
    () => new Map(events.map((event) => [event.id, event])),
    [events],
  );

  const calendarEvents = useMemo(
    () => events.map((event) => toCalendarEvent(event)),
    [events],
  );

  function handleEventUpdate(updatedEvent: CalendarEvent) {
    const originalEvent = eventMap.get(updatedEvent.id);

    if (!originalEvent || originalEvent.eventType !== "workout") {
      return;
    }

    if (
      originalEvent.workoutStatus === "completed" ||
      originalEvent.workoutStatus === "active"
    ) {
      return;
    }

    const nextDate = toDateString(updatedEvent.start);

    if (nextDate === originalEvent.date) {
      return;
    }

    onMoveEventToDate(originalEvent.eventId, nextDate);
  }

  function handleEventSelect(selectedEvent: CalendarEvent) {
    const originalEvent = eventMap.get(selectedEvent.id);

    if (!originalEvent) {
      return;
    }

    onEditSession(originalEvent);
  }

  return (
    <section
      className="coss-calendar-scope overflow-hidden rounded-2xl bg-white shadow-sm"
      style={{ border: "1px solid #E5E7EB" }}
    >
      <style>
        {`
          .coss-calendar-scope {
            --calendar-body-height: 650px;
          }

          .coss-calendar-scope .coss-calendar-shell {
            width: 100%;
            height: var(--calendar-body-height);
            min-height: var(--calendar-body-height);
          }

          .coss-calendar-scope [data-slot="month-view"] {
            height: 100%;
            min-height: var(--calendar-body-height);
          }

          .coss-calendar-scope .coss-event-completed,
          .coss-calendar-scope .coss-event-completed * {
            text-decoration-line: line-through;
            opacity: 0.8;
          }

          .coss-calendar-scope .coss-event-missed,
          .coss-calendar-scope .coss-event-missed * {
            color: #B91C1C !important;
          }

          .coss-calendar-scope .coss-event-active,
          .coss-calendar-scope .coss-event-active * {
            font-weight: 700;
          }
        `}
      </style>

      <div
        className="flex flex-col gap-4 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderBottom: "1px solid #ECEEF2" }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onPress={() => onCurrentDateChange(new Date())}
            className="min-w-fit rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-[12px] font-semibold text-indigo-600"
          >
            Today
          </Button>

          <Button
            variant="ghost"
            onPress={() => onCurrentDateChange(addMonths(currentDate, -1))}
            className="min-w-10 rounded-xl border border-[#E5E7EB] bg-white px-0 text-[#0F0F14]"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            onPress={() => onCurrentDateChange(addMonths(currentDate, 1))}
            className="min-w-10 rounded-xl border border-[#E5E7EB] bg-white px-0 text-[#0F0F14]"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <h2 className="ml-1 text-[18px] font-semibold text-[#0F0F14]">
            {formatMonthYear(currentDate)}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            onPress={() => navigate("/client/recommendation")}
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-[12px] font-semibold text-[#0F0F14]"
          >
            <span className="inline-flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-indigo-500" />
              <span>Recommended Plans</span>
            </span>
          </Button>

          <Button
            variant="outline"
            onPress={() => navigate("/client/createWorkout")}
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-[12px] font-semibold text-[#0F0F14]"
          >
            <span className="inline-flex items-center gap-2">
              <ClipboardPlus className="h-4 w-4 text-indigo-500" />
              <span>Create Plan</span>
            </span>
          </Button>

          <Button
            variant="primary"
            onPress={() => onAddSession(withDefaultStartTime(currentDate))}
            className="rounded-xl border-0 bg-indigo-500 px-4 py-2 text-[12px] font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add Session
          </Button>
        </div>
      </div>

      <CalendarDndProvider onEventUpdate={handleEventUpdate}>
        <div
          className={`coss-calendar-shell relative transition-opacity duration-200 ease-out ${
            isLoading ? "opacity-85" : "opacity-100"
          }`}
        >
          <MonthView
            currentDate={currentDate}
            events={calendarEvents}
            onEventSelect={handleEventSelect}
            onEventCreate={(date: Date) =>
              onAddSession(withDefaultStartTime(date))
            }
          />
        </div>
      </CalendarDndProvider>
    </section>
  );
}
