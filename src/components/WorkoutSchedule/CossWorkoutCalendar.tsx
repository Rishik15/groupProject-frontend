import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo } from "react";

import type { WorkoutCalendarEvent } from "../../utils/Interfaces/WorkoutLog/workoutLog";
import { toDateString } from "../../utils/WorkoutLog/useWorkoutSchedule";
import { CalendarDndProvider } from "../event-calendar/calendar-dnd-context";
import { MonthView } from "../event-calendar/month-view";
import type { CalendarEvent } from "../event-calendar/types";

interface CossWorkoutCalendarProps {
    currentDate: Date;
    events: WorkoutCalendarEvent[];
    isLoading?: boolean;
    onCurrentDateChange: (date: Date) => void;
    onAddSession: (date: Date) => void;
    onEditSession: (event: WorkoutCalendarEvent) => void;
    onMoveEventToDate: (eventId: string, nextDate: string) => void | Promise<void>;
    onLogWorkout?: () => void;
}

const COLOR_BY_KIND: Record<string, CalendarEvent["color"]> = {
    strength: "violet",
    cardio: "sky",
    yoga: "emerald",
    rest: "amber",
    nutrition: "orange",
    other: "rose",
};

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

function toCalendarEvent(event: WorkoutCalendarEvent): CalendarEvent {
    return {
        id: event.id,
        title: event.title,
        description: event.notes?.trim() || undefined,
        start: toDateTime(event.date, event.startTime),
        end: toDateTime(event.date, event.endTime),
        color: COLOR_BY_KIND[event.kind] ?? "rose",
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
    onLogWorkout,
}: CossWorkoutCalendarProps) {
    const eventMap = useMemo(
        () => new Map(events.map((event) => [event.id, event])),
        [events],
    );

    const calendarEvents = useMemo(
        () => events.map(toCalendarEvent),
        [events],
    );

    function handleEventUpdate(updatedEvent: CalendarEvent) {
        const originalEvent = eventMap.get(updatedEvent.id);
        if (!originalEvent) {
            return;
        }

        const nextDate = toDateString(updatedEvent.start);
        if (nextDate === originalEvent.date) {
            return;
        }

        void onMoveEventToDate(originalEvent.id, nextDate);
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
            className="coss-calendar-scope overflow-hidden rounded-3xl bg-white shadow-sm"
            style={{ border: "1px solid #5E5EF44D" }}
        >
            <style>
                {`
                    .coss-calendar-scope {
                        --calendar-row-min-height: 90px;
                    }

                    .coss-calendar-scope .coss-calendar-shell {
                        width: 100%;
                    }

                    .coss-calendar-scope .coss-calendar-shell > div {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                    }

                    /* keep the weekday header compact */
                    .coss-calendar-scope .coss-calendar-shell > div > .grid:first-of-type {
                        flex: 0 0 auto;
                    }

                    /* enlarge only the actual day grid */
                    .coss-calendar-scope .coss-calendar-shell > div > .grid:last-of-type {
                        grid-auto-rows: minmax(var(--calendar-row-min-height), auto);
                        align-content: start;
                    }

                    .coss-calendar-scope .coss-calendar-shell > div > .grid:last-of-type > * {
                        min-height: var(--calendar-row-min-height);
                    }
                `}
            </style>

            <div
                className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderBottom: "1px solid #5E5EF44D" }}
            >
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onPress={() => onCurrentDateChange(new Date())}
                        className="min-w-fit rounded-xl bg-[#5E5EF414] text-[11.25px] font-semibold text-[#5E5EF4]"
                    >
                        Today
                    </Button>

                    <Button
                        variant="ghost"
                        onPress={() => onCurrentDateChange(addMonths(currentDate, -1))}
                        className="min-w-10 rounded-xl border border-[#5E5EF433] px-0"
                        aria-label="Previous month"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        onPress={() => onCurrentDateChange(addMonths(currentDate, 1))}
                        className="min-w-10 rounded-xl border border-[#5E5EF433] px-0"
                        aria-label="Next month"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>

                    <h2 className="ml-1 text-[18px] font-semibold text-[#0F0F14]">
                        {formatMonthYear(currentDate)}
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {onLogWorkout ? (
                        <Button
                            variant="outline"
                            onPress={onLogWorkout}
                            className="rounded-xl bg-[#5E5EF414] text-[11.25px] font-semibold text-[#5E5EF4]"
                        >
                            Log Active Workout
                        </Button>
                    ) : null}

                    <Button
                        variant="primary"
                        onPress={() => onAddSession(withDefaultStartTime(currentDate))}
                        className="rounded-xl text-[11.25px] font-semibold text-white"
                    >
                        <Plus className="h-4 w-4" />
                        Add Session
                    </Button>
                </div>
            </div>

            <CalendarDndProvider onEventUpdate={handleEventUpdate}>
                <div className="coss-calendar-shell relative">
                    <MonthView
                        currentDate={currentDate}
                        events={calendarEvents}
                        onEventSelect={handleEventSelect}
                        onEventCreate={(date: Date) => onAddSession(withDefaultStartTime(date))}
                    />

                    {isLoading ? (
                        <div className="absolute inset-0 z-20 bg-[#FFFFFF80]" />
                    ) : null}
                </div>
            </CalendarDndProvider>
        </section>
    );
}