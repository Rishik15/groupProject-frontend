import { useMemo, useState } from "react";

import type { WorkoutCalendarEvent } from "../Interfaces/WorkoutLog/workoutLog";
import { toDateString } from "./useWorkoutSchedule";
import {
    addDays,
    dateFromDateString,
    getMonday,
    toHourTimeString,
} from "../../components/WorkoutSchedule/calendarUtils";

export default function useWorkoutScheduleView() {
    const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
    const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() =>
        toDateString(getMonday(new Date())),
    );
    const [selectedStartTime, setSelectedStartTime] = useState("06:00");
    const [editingEvent, setEditingEvent] = useState<WorkoutCalendarEvent | null>(null);
    const [draggedEventId, setDraggedEventId] = useState<string | null>(null);

    const weekDays = useMemo(
        () => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)),
        [weekStart],
    );

    function goToPreviousWeek() {
        setWeekStart((previous) => addDays(previous, -7));
    }

    function goToNextWeek() {
        setWeekStart((previous) => addDays(previous, 7));
    }

    function jumpToNow() {
        const now = new Date();
        setWeekStart(getMonday(now));
        setSelectedDate(toDateString(now));
        setSelectedStartTime(toHourTimeString(now.getHours()));
    }

    function handleModalOpenChange(open: boolean) {
        setIsAddSessionOpen(open);

        if (!open) {
            setEditingEvent(null);
        }
    }

    function openAddSession(date: Date, hour: number) {
        setEditingEvent(null);
        setSelectedDate(toDateString(date));
        setSelectedStartTime(toHourTimeString(hour));
        setIsAddSessionOpen(true);
    }

    function openEditSession(event: WorkoutCalendarEvent) {
        setEditingEvent(event);
        setSelectedDate(event.date);
        setSelectedStartTime(event.startTime);
        setIsAddSessionOpen(true);
    }

    function openAddSessionFromSelectedDate() {
        openAddSession(dateFromDateString(selectedDate), 6);
    }

    return {
        weekStart,
        weekDays,
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
    };
}
