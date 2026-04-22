import type { TimeValue } from "@heroui/react";
import type { DateValue } from "@internationalized/date";

export const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export const revokeBlobUrl = (url?: string | null) => {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

const pad = (value: number) => String(value).padStart(2, "0");

const hasExplicitTimeZone = (value: string) => /(?:Z|[+-]\d{2}:\d{2})$/.test(value);

export const buildTakenAtIso = (
  takenOn: DateValue | null,
  takenTime: TimeValue | null,
) => {
  if (!takenOn || !takenTime) {
    return "";
  }

  const second = takenTime.second ?? 0;

  // Keep the user's selected wall-clock time exactly as entered.
  // Do NOT convert to UTC here.
  return `${takenOn.year}-${pad(takenOn.month)}-${pad(takenOn.day)}T${pad(
    takenTime.hour,
  )}:${pad(takenTime.minute)}:${pad(second)}`;
};

export const parseBackendDateTime = (value?: string | null) => {
  if (!value) {
    return null;
  }

  // If backend sends a real UTC/offset-aware timestamp, let Date handle it.
  if (hasExplicitTimeZone(value)) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  // If backend sends a timezone-less value like 2026-04-18T22:30:00,
  // interpret it as local browser time.
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?$/,
  );

  if (!match) {
    const fallback = new Date(value);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }

  const [, year, month, day, hour, minute, second = "0", ms = "0"] = match;

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
    Number(ms.padEnd(3, "0")),
  );
};

export const formatDateTime = (value?: string | null) => {
  const parsed = parseBackendDateTime(value);

  if (!parsed) {
    return "";
  }

  return parsed.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatTimeOnly = (value?: string | null) => {
  const parsed = parseBackendDateTime(value);

  if (!parsed) {
    return "";
  }

  return parsed.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};