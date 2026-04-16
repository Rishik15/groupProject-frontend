export function getMonday(date: Date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);

    const dayIndex = (result.getDay() + 6) % 7;
    result.setDate(result.getDate() - dayIndex);

    return result;
}

export function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function dateFromDateString(value: string) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
}

export function toHourTimeString(hour: number) {
    return `${String(hour).padStart(2, "0")}:00`;
}

export function formatWeekRange(start: Date, end: Date) {
    const startLabel = start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    const endLabel = end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return `${startLabel} – ${endLabel}`;
}

export function formatDayName(date: Date) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function formatDayNumber(date: Date) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatHourLabel(hour: number) {
    const suffix = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${suffix}`;
}

function formatSingleTime(timeValue: string) {
    const date = new Date();
    const [hour, minute] = timeValue.split(":").map(Number);

    date.setHours(hour, minute, 0, 0);

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

export function formatTimeRange(startTime: string, endTime: string) {
    return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`;
}
