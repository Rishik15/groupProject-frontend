export const numberOrNull = (value: string) => {
  if (!value.trim()) return null;

  const parsed = Number(value);

  return Number.isNaN(parsed) ? null : parsed;
};

export const toInputValue = (value: number | null) => {
  if (value === null || value === undefined) return "";

  return String(value);
};
