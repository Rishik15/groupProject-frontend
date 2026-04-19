import { useMemo, useState } from "react";

import type { WorkoutCalendarEvent } from "../../utils/Interfaces/WorkoutLog/workoutLog";
import useWorkoutSchedule, {
    toDateString,
} from "../../utils/WorkoutLog/useWorkoutSchedule";
import AddSessionModal from "./AddSessionModal";
import CossWorkoutCalendar from "./CossWorkoutCalendar";

interface WeeklyWorkoutScheduleProps {
    refreshToken?: number;
    onOpenWorkoutLog: (event?: WorkoutCalendarEvent | null) => void;
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

function getHourFromTime(time: string) {
    const [hours = "0"] = time.split(":");
    const parsed = Number(hours);
    return Number.isFinite(parsed) ? parsed : 0;
}

export default function WeeklyWorkoutSchedule({
    refreshToken = 0,
    onOpenWorkoutLog,
}: WeeklyWorkoutScheduleProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => toDateString(new Date()));
    const [selectedStartTime, setSelectedStartTime] = useState("06:00");
    const [editingEvent, setEditingEvent] = useState<WorkoutCalendarEvent | null>(null);

    const rangeStart = useMemo(
        () => toDateString(startOfWeek(startOfMonth(currentDate))),
        [currentDate],
    );

    const rangeEnd = useMemo(
        () => toDateString(endOfWeek(endOfMonth(currentDate))),
        [currentDate],
    );

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
    } = useWorkoutSchedule(refreshToken, rangeStart, rangeEnd);

    function handleOpenAddSession(date: Date) {
        setEditingEvent(null);
        setSelectedDate(toDateString(date));
        setSelectedStartTime("06:00");
        setIsAddSessionOpen(true);
    }

    function handleOpenEditSession(event: WorkoutCalendarEvent) {
        if (event.source === "active-session") {
            onOpenWorkoutLog(activeEvent);
            return;
        }

        setEditingEvent(event);
        setSelectedDate(event.date);
        setSelectedStartTime(event.startTime);
        setIsAddSessionOpen(true);
    }

    async function handleMoveEventToDate(eventId: string, nextDate: string) {
        const targetEvent = events.find((event) => event.id === eventId);
        if (!targetEvent) {
            return;
        }

        const isAttachedActive =
            activeSessionId != null &&
            targetEvent.sessionId != null &&
            targetEvent.sessionId === activeSessionId;

        if (targetEvent.source === "active-session" || isAttachedActive) {
            return;
        }

        const nextHour = getHourFromTime(targetEvent.startTime);

        try {
            await moveLocalEvent(eventId, nextDate, nextHour);
        } catch (error) {
            console.error("[Workout Schedule] failed to move schedule event", error);
        }
    }

    return (
        <>
            {errorMessage ? (
                <div
                    className="mb-4 rounded-2xl px-4 py-3 text-[11.25px] text-[#72728A]"
                    style={{
                        border: "1px solid #5E5EF44D",
                        backgroundColor: "#5E5EF414",
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
                onLogWorkout={
                    activeEvent ? () => onOpenWorkoutLog(activeEvent) : undefined
                }
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
                onCreate={addLocalEvent}
                onUpdate={updateLocalEvent}
                onDelete={removeLocalEvent}
                onSetActive={setEventActive}
            />
        </>
    );
}