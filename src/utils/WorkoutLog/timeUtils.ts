export function normalizeTimeForInput(value: string) {
    const trimmed = value.trim().replace(/:+$/, "");

    const parts = trimmed.split(":").filter(Boolean);

    if (parts.length < 2) {
        return "00:00";
    }

    const hours = String(Number(parts[0] ?? 0)).padStart(2, "0");
    const minutes = String(Number(parts[1] ?? 0)).padStart(2, "0");

    return `${hours}:${minutes}`;
}

export function addOneHourToTime(value: string) {
    const safeValue = normalizeTimeForInput(value);
    const [hours, minutes] = safeValue.split(":").map(Number);

    const nextHour = String((hours + 1) % 24).padStart(2, "0");
    const nextMinute = String(minutes).padStart(2, "0");

    return `${nextHour}:${nextMinute}`;
}