export function ActionBtn({
  onClick,
  icon,
  color,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  color: "green" | "gray" | "red";
}) {
  const styles = {
    green: "bg-green-100 text-green-600",
    gray: "bg-gray-100 text-gray-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-full ${styles[color]}`}
    >
      {icon}
    </button>
  );
}