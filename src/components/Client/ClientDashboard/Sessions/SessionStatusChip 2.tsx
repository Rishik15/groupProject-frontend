import { Chip } from "@heroui/react";

export type SessionStatus = "not_started" | "active" | "completed" | "missed";

interface SessionStatusChipProps {
  status: SessionStatus;
}

const SessionStatusChip = ({ status }: SessionStatusChipProps) => {
  if (status === "active") {
    return (
      <Chip color="success" size="sm" variant="soft">
        Active
      </Chip>
    );
  }

  if (status === "completed") {
    return (
      <Chip className="bg-indigo-100 text-indigo-700" size="sm" variant="soft">
        Completed
      </Chip>
    );
  }

  if (status === "missed") {
    return (
      <Chip color="danger" size="sm" variant="soft">
        Missed
      </Chip>
    );
  }

  return (
    <Chip className="bg-violet-100 text-violet-700" size="sm" variant="soft">
      Scheduled
    </Chip>
  );
};

export default SessionStatusChip;
