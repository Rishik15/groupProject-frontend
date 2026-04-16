import type { DragEvent } from "react";

import type { WorkoutCalendarEvent } from "../../utils/Interfaces/WorkoutLog/workoutLog";
import { toDateString } from "../../utils/WorkoutLog/useWorkoutSchedule";
import { formatDayName, formatDayNumber, formatHourLabel } from "./calendarUtils";
import { HOURS, ROW_HEIGHT } from "./constants";
import ScheduleEventCard from "./ScheduleEventCard";

interface ScheduleGridProps {
    weekDays: Date[];
    visibleEvents: WorkoutCalendarEvent[];
    isLoading: boolean;
    draggedEventId: string | null;
    activeSessionId?: number | null;
    onOpenAddSession: (date: Date, hour: number) => void;
    onEditSession: (event: WorkoutCalendarEvent) => void;
    onDeleteSession: (eventId: string) => void;
    onSetActiveSession: (event: WorkoutCalendarEvent) => void;
    onLogWorkout: (event: WorkoutCalendarEvent) => void;
    onEventDragStart: (event: DragEvent<HTMLElement>, workoutEvent: WorkoutCalendarEvent) => void;
    onEventDragEnd: () => void;
    onDayColumnDrop: (event: DragEvent<HTMLDivElement>, targetDate: string) => void;
    onDayColumnDragOver: (event: DragEvent<HTMLDivElement>) => void;
}

export default function ScheduleGrid({
    weekDays,
    visibleEvents,
    isLoading,
    draggedEventId,
    activeSessionId = null,
    onOpenAddSession,
    onEditSession,
    onDeleteSession,
    onSetActiveSession,
    onLogWorkout,
    onEventDragStart,
    onEventDragEnd,
    onDayColumnDrop,
    onDayColumnDragOver,
}: ScheduleGridProps) {
    return (
        <div className="mt-6 overflow-x-auto">
            <div className="min-w-[1540px]">
                <div
                    className="grid grid-cols-[88px_repeat(7,minmax(206px,1fr))] overflow-hidden rounded-t-3xl border-b-0"
                    style={{ border: "1px solid #E8E8EF" }}
                >
                    <div className="border-r border-[#E8E8EF] bg-white" />

                    {weekDays.map((day) => (
                        <div
                            key={toDateString(day)}
                            className="border-r border-[#E8E8EF] bg-white px-3 py-4 text-center last:border-r-0"
                        >
                            <div className="text-[13.125px] font-semibold text-[#0F0F14]">
                                {formatDayName(day)}
                            </div>

                            <div className="mt-1 text-[11.25px] text-[#72728A]">
                                {formatDayNumber(day)}
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className="grid grid-cols-[88px_repeat(7,minmax(206px,1fr))] overflow-hidden rounded-b-3xl"
                    style={{ border: "1px solid #E8E8EF", borderTop: "0" }}
                >
                    <div className="border-r border-[#E8E8EF] bg-white">
                        {HOURS.map((hour) => (
                            <div
                                key={hour}
                                style={{ height: ROW_HEIGHT }}
                                className="flex items-start justify-end border-b border-[#F0F1F5] pr-3 pt-3 text-[11.25px] text-[#72728A] last:border-b-0"
                            >
                                <span className="whitespace-nowrap">{formatHourLabel(hour)}</span>
                            </div>
                        ))}
                    </div>

                    {weekDays.map((day) => {
                        const dayKey = toDateString(day);
                        const dayEvents = visibleEvents.filter((event) => event.date === dayKey);

                        return (
                            <div
                                key={dayKey}
                                className="relative border-r border-[#E8E8EF] bg-white last:border-r-0"
                                style={{
                                    height: HOURS.length * ROW_HEIGHT,
                                    outline: draggedEventId ? "1px dashed #5E5EF433" : "none",
                                }}
                                onDrop={(event) => onDayColumnDrop(event, dayKey)}
                                onDragOver={onDayColumnDragOver}
                            >
                                {HOURS.map((hour) => (
                                    <button
                                        key={hour}
                                        type="button"
                                        onClick={() => onOpenAddSession(day, hour)}
                                        className="absolute inset-x-0 z-0 border-b border-[#F0F1F5] transition hover:bg-[#5E5EF40A]"
                                        style={{
                                            top: hour * ROW_HEIGHT,
                                            height: ROW_HEIGHT,
                                        }}
                                        aria-label={`Add session on ${dayKey} at ${formatHourLabel(hour)}`}
                                    />
                                ))}

                                {dayEvents.map((event) => (
                                    <ScheduleEventCard
                                        key={event.id}
                                        event={event}
                                        activeSessionId={activeSessionId}
                                        onEdit={onEditSession}
                                        onDelete={onDeleteSession}
                                        onSetActive={onSetActiveSession}
                                        onLogWorkout={onLogWorkout}
                                        onDragStart={onEventDragStart}
                                        onDragEnd={onEventDragEnd}
                                    />
                                ))}

                                {isLoading ? <div className="absolute inset-0 z-20 bg-[#FFFFFF59]" /> : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
