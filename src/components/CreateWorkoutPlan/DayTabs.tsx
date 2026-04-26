interface Day {
  label: string;
  exercises: any[];
}

interface Props {
  days: Day[];
  activeDay: number;
  onSelectDay: (index: number) => void;
  onRenameDay: (index: number, label: string) => void;
}

export default function DayTabs({ days, activeDay, onSelectDay, onRenameDay }: Props) {
  return (
    <div className="flex gap-0 border-b border-[#E6E6EE] overflow-x-auto">
      {days.map((day, i) => (
        <button
          key={i}
          onClick={() => onSelectDay(i)}
          className="shrink-0 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 flex items-center gap-1"
          style={{
            borderColor: activeDay === i ? "#5B5EF4" : "transparent",
            color: activeDay === i ? "#5B5EF4" : "#72728A",
          }}
        >
          {activeDay === i ? (
            <input
              value={day.label}
              onChange={(e) => onRenameDay(i, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="bg-transparent outline-none w-20 text-sm font-medium text-[#5B5EF4]"
            />
          ) : (
            <span>{day.label}</span>
          )}
          <span className="text-xs text-[#72728A]">({day.exercises.length})</span>
        </button>
      ))}
    </div>
  );
}