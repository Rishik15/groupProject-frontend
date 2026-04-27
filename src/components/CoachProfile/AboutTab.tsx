import { Card } from "@heroui/react";
import type { CoachProfile } from "../../services/contract/requestcontracts.ts";

function StatBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-default-500">{label}</span>
        <span className="text-sm font-semibold text-foreground">{value}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-default-100">
        <div
          className="h-1.5 rounded-full bg-[#5B5EF4] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function formatTime(time: string): string {
  const [hour, minute] = time.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:${minute.toString().padStart(2, "0")}${ampm}`;
}

export default function AboutTab({ coach }: { coach: CoachProfile }) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="p-6 flex flex-col gap-5">
        <div>
          <p className="text-xs text-default-400 mb-1">Bio</p>
          <p className="text-sm text-foreground leading-relaxed">
            {coach.coach_description}
          </p>
        </div>

        <div>
          <p className="text-xs text-default-400 mb-2">Availability</p>
          <div className="flex flex-col gap-1.5">
            {coach.availability.map((slot, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="font-medium w-8">{slot.day_of_week}</span>
                <span className="text-default-400">
                  {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 flex flex-col gap-4">
        <p className="text-base font-semibold text-foreground">Coach Stats</p>
        <StatBar
          label="Active Clients"
          value={coach.active_clients}
          max={100}
        />
      </Card>
    </div>
  );
}
