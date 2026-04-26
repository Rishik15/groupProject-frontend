import { parseTime, type Time } from "@internationalized/date";

export const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const parseBackendTime = (value?: string) => {
  if (!value) return null;

  const parts = value.split(":");
  const hour = parts[0]?.padStart(2, "0");
  const minute = parts[1];

  if (!hour || !minute) return null;

  return parseTime(`${hour}:${minute}`);
};

export const formatTime = (value: Time) => {
  const hour = String(value.hour).padStart(2, "0");
  const minute = String(value.minute).padStart(2, "0");
  return `${hour}:${minute}:00`;
};

export const editableClass = "rounded-md border border-gray-200 bg-white";
export const readonlyClass = "rounded-md bg-gray-100";

export const getInputClass = (editable: boolean) =>
  editable ? editableClass : readonlyClass;

export const getTimeBoxClass = (edit: boolean) =>
  edit
    ? "flex min-h-10 items-center rounded-md border border-gray-200 bg-white px-3"
    : "flex min-h-10 items-center rounded-md bg-gray-100 px-3";