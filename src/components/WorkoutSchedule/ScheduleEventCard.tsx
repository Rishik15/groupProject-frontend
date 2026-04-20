import { Clock3, Dumbbell, Trash2 } from "lucide-react";
import type { DragEvent } from "react";

import type {
    WorkoutCalendarEvent,
    WorkoutScheduleStatus,
} from "../../utils/Interfaces/WorkoutLog/workoutLog";
import { getEffectiveStatus, timeStringToMinutes } from "../../utils/WorkoutLog/useWorkoutSchedule";
import { EVENT_STYLES, ROW_HEIGHT } from "./constants";
import { formatTimeRange } from "./calendarUtils";

function getStatusLabel(status: WorkoutScheduleStatus) {
    if (status === "scheduled") {
        return "Scheduled";
    }

    if (status === "active") {
        return "Active";
    }

    if (status === "complete" || status === "done") {
        return "Done";
    }

    return "Missed";
}

function getEventCardHeight(event: WorkoutCalendarEvent) {
    const startMinutes = timeStringToMinutes(event.startTime);
    const endMinutes = timeStringToMinutes(event.endTime);
    const durationHeight = ((endMinutes - startMinutes) / 60) * ROW_HEIGHT;
    return Math.max(durationHeight - 8, 76);
}

interface ScheduleEventCardProps {
    event: WorkoutCalendarEvent;
    activeSessionId?: number | null;
    onEdit: (event: WorkoutCalendarEvent) => void;
    onDelete: (eventId: string) => void;
    onSetActive: (event: WorkoutCalendarEvent) => void;
    onLogWorkout: (event: WorkoutCalendarEvent) => void;
    onDragStart: (event: DragEvent<HTMLElement>, workoutEvent: WorkoutCalendarEvent) => void;
    onDragEnd: () => void;
}

export default function ScheduleEventCard({
    event,
    activeSessionId = null,
    onEdit,
    onDelete,
    onSetActive,
    onLogWorkout,
    onDragStart,
    onDragEnd,
}: ScheduleEventCardProps) {
    const startMinutes = timeStringToMinutes(event.startTime);
    const top = (startMinutes / 60) * ROW_HEIGHT + 4;
    const height = getEventCardHeight(event);
    const effectiveStatus = getEffectiveStatus(event);
    const styleSet = EVENT_STYLES[event.kind] ?? EVENT_STYLES.other;

    const isAttachedActive =
        activeSessionId != null &&
        event.sessionId != null &&
        event.sessionId === activeSessionId;

    const isEditable = event.source !== "active-session";
    const isDraggable = isEditable && !isAttachedActive;
    const showSetActiveButton = isEditable && !isAttachedActive && effectiveStatus === "scheduled";
    const showLogButton = isAttachedActive;

    return (
        <div
            draggable={isDraggable}
            onDragStart={
                isDraggable ? (dragEvent) => onDragStart(dragEvent, event) : undefined
            }
            onDragEnd={isDraggable ? onDragEnd : undefined}
            className="group absolute left-2 right-2 z-10 overflow-hidden rounded-[24px] shadow-sm"
            style={{
                top,
                height,
                backgroundColor: styleSet.background,
                border: `1px solid ${styleSet.border}`,
                color: styleSet.text,
                padding: "8px 12px 12px",
                cursor: isDraggable ? "grab" : "default",
            }}
        >
            {isEditable ? (
                <button
                    type="button"
                    onClick={() => onDelete(event.id)}
                    className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#FFFFFFD9] bg-[#FFFFFFE6] text-[#0F0F14] opacity-100 transition hover:bg-[#FFFFFF]"
                    aria-label="Delete session"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            ) : null}

            <button
                type="button"
                onClick={() => onEdit(event)}
                className="block w-full pr-7 text-left"
            >
                <div className="truncate text-[13.125px] font-semibold leading-[1.15] text-[#0F0F14]">
                    {event.title}
                </div>

                <div className="mt-1 flex items-center gap-1 text-[11.25px] text-[#72728A] opacity-90">
                    <Clock3 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{formatTimeRange(event.startTime, event.endTime)}</span>
                </div>
            </button>

            <div className="mt-1 grid grid-cols-[1fr_auto] items-center gap-2 pr-7">
                <div className="justify-self-start">
                    <span
                        className="inline-flex items-center rounded-full px-2 py-1 text-[10.5px] font-semibold leading-none whitespace-nowrap text-[#0F0F14]"
                        style={{ backgroundColor: styleSet.pill }}
                    >
                        {getStatusLabel(isAttachedActive ? "active" : effectiveStatus)}
                    </span>
                </div>

                {showLogButton ? (
                    <button
                        type="button"
                        onClick={() => onLogWorkout(event)}
                        className="justify-self-end rounded-full px-2 py-1 text-[10.5px] font-semibold leading-none whitespace-nowrap text-white"
                        style={{ backgroundColor: "#5E5EF4" }}
                    >
                        <span className="inline-flex items-center gap-1">
                            <Dumbbell className="h-3.5 w-3.5" />
                            <span>Log</span>
                        </span>
                    </button>
                ) : showSetActiveButton ? (
                    <button
                        type="button"
                        onClick={() => onSetActive(event)}
                        className="justify-self-end rounded-full px-2 py-1 text-[10px] font-semibold leading-none whitespace-nowrap text-white"
                        style={{ backgroundColor: "#5E5EF4" }}
                    >
                        Set Active
                    </button>
                ) : null}
            </div>
        </div>
    );
}
