interface ActivityLogMessageProps {
  message: string;
}

const ActivityLogMessage = ({ message }: ActivityLogMessageProps) => {
  if (!message) return null;

  return (
    <div className="rounded-xl bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
      {message}
    </div>
  );
};

export default ActivityLogMessage;
