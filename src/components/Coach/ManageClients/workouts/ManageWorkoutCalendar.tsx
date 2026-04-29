import { Button } from "@heroui/react";
import { CalendarPlus, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo } from "react";

import type { ManageWorkoutEvent } from "@/services/ManageClients/workout/getClients";

import { CalendarDndProvider } from "../../../event-calendar/calendar-dnd-context";
import { MonthView } from "../../../event-calendar/month-view";
import type { CalendarEvent } from "../../../event-calendar/types";

type CalendarEventWithDrag = CalendarEvent & {
  isDraggable?: boolean;
  className?: string;
};

interface ManageWorkoutCalendarProps {
  currentDate: Date;
  events: ManageWorkoutEvent[];
  isLoading?: boolean;
  onCurrentDateChange: (date: Date) => void;
  onAddSession: (date: Date) => void;
  onAssignPlan: () => void;
  onEditSession: (event: ManageWorkoutEvent) => void;
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

function withDefaultStartTime(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(6, 0, 0, 0);

  return nextDate;
}

function getEventColor(event: ManageWorkoutEvent) {
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

function getEventTitle(event: ManageWorkoutEvent) {
  const time = event.startTime ? event.startTime.slice(0, 5) : "";
  const title = time ? `${time} ${event.title}` : event.title;

  if (event.eventType === "coach_session") {
    return `Coach: ${title}`;
  }

  if (event.workoutStatus === "missed") {
    return `Missed: ${title}`;
  }

  if (event.workoutStatus === "active") {
    return `Active: ${title}`;
  }

  return title;
}

function getEventClassName(event: ManageWorkoutEvent) {
  if (event.eventType === "coach_session") {
    return "manage-event-coach-session";
  }

  if (event.workoutStatus === "completed") {
    return "manage-event-completed";
  }

  if (event.workoutStatus === "missed") {
    return "manage-event-missed";
  }

  if (event.workoutStatus === "active") {
    return "manage-event-active";
  }

  return "";
}

function toCalendarEvent(event: ManageWorkoutEvent): CalendarEventWithDrag {
  return {
    id: event.id,
    title: getEventTitle(event),
    description: event.description || undefined,
    start: toDateTime(event.date, event.startTime),
    end: toDateTime(event.date, event.endTime),
    color: getEventColor(event),
    isDraggable:
      event.eventType === "workout" &&
      event.workoutStatus !== "completed" &&
      event.workoutStatus !== "active",
    className: getEventClassName(event),
  };
}

export default function ManageWorkoutCalendar({
  currentDate,
  events,
  isLoading = false,
  onCurrentDateChange,
  onAddSession,
  onAssignPlan,
  onEditSession,
  onMoveEventToDate,
}: ManageWorkoutCalendarProps) {
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
      className="manage-calendar-scope overflow-hidden rounded-2xl bg-white shadow-sm"
      style={{ border: "1px solid #E5E7EB" }}
    >
      <style>
        {`
          .manage-calendar-scope {
            --calendar-body-height: 650px;
          }

          .manage-calendar-scope .manage-calendar-shell {
            width: 100%;
            height: var(--calendar-body-height);
            min-height: var(--calendar-body-height);
          }

          .manage-calendar-scope [data-slot="month-view"] {
            height: 100%;
            min-height: var(--calendar-body-height);
          }

          .manage-calendar-scope .manage-event-completed,
          .manage-calendar-scope .manage-event-completed * {
            text-decoration-line: line-through;
            opacity: 0.8;
          }

          .manage-calendar-scope .manage-event-missed,
          .manage-calendar-scope .manage-event-missed * {
            color: #B91C1C !important;
          }

          .manage-calendar-scope .manage-event-active,
          .manage-calendar-scope .manage-event-active * {
            font-weight: 700;
          }

          .manage-calendar-scope .manage-event-coach-session,
          .manage-calendar-scope .manage-event-coach-session * {
            color: #0369A1 !important;
            background-color: #E0F2FE !important;
          }
        `}
      </style>

      <div className="flex flex-col gap-4 border-b border-[#ECEEF2] bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onPress={() => onCurrentDateChange(new Date())}
            className="min-w-fit rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2 font-primary text-[12px] font-semibold text-indigo-600"
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

          <h2 className="ml-1 font-primary text-[18px] font-semibold text-[#0F0F14]">
            {formatMonthYear(currentDate)}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            onPress={onAssignPlan}
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 font-primary text-[12px] font-semibold text-[#0F0F14]"
          >
            <span className="inline-flex items-center gap-2">
              <CalendarPlus className="h-4 w-4 text-indigo-500" />
              <span>Assign Workout Plan</span>
            </span>
          </Button>

          <Button
            variant="primary"
            onPress={() => onAddSession(withDefaultStartTime(currentDate))}
            className="rounded-xl border-0 bg-indigo-500 px-4 py-2 font-primary text-[12px] font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add Session
          </Button>
        </div>
      </div>

      <CalendarDndProvider onEventUpdate={handleEventUpdate}>
        <div
          className={`manage-calendar-shell relative transition-opacity duration-200 ease-out ${
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
