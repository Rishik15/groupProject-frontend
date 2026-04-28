import type {
  AccountStatus,
  AdminCoachApplicationStatus,
  AdminCoachPriceRequestStatus,
  AdminReportBucket,
  VideoStatus,
} from "../Interfaces/Admin";

const fallbackFormatter = (value: string | null | undefined): string => value ?? "—";

export const formatAdminDateTime = (
  value: string | null | undefined,
  locale = "en-US",
): string => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const formatAdminCurrency = (
  value: number | null | undefined,
  currency = "USD",
  locale = "en-US",
): string => {
  if (value === null || value === undefined) return "—";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatAccountStatusLabel = (status: AccountStatus): string => {
  switch (status) {
    case "active":
      return "Active";
    case "suspended":
      return "Suspended";
    case "deactivated":
      return "Deactivated";
    default:
      return fallbackFormatter(status);
  }
};

export const formatVideoStatusLabel = (status: VideoStatus): string => {
  switch (status) {
    case "pending":
      return "Pending Review";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return fallbackFormatter(status);
  }
};

export const formatCoachApplicationStatusLabel = (
  status: AdminCoachApplicationStatus,
): string => {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return fallbackFormatter(status);
  }
};

export const formatCoachPriceStatusLabel = (
  status: AdminCoachPriceRequestStatus,
): string => {
  switch (status) {
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return fallbackFormatter(status);
  }
};

export const formatReportBucketLabel = (bucket: AdminReportBucket): string => {
  switch (bucket) {
    case "open":
      return "Open Reports";
    case "closed":
      return "Closed Reports";
    default:
      return fallbackFormatter(bucket);
  }
};

export const formatBooleanLabel = (value: boolean): string =>
  value ? "Yes" : "No";
