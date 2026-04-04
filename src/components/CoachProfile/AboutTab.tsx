import { Card } from "@heroui/react";

interface AboutTabProps {
  bio: string;
  certifications: string[];
  specialties: string[];
  availability: string;
  active_clients: number;
  success_rate: number;
}

function StatBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-default-500">{label}</span>
        <span className="text-sm font-semibold text-foreground">
          {value}{label === "Success Rate" ? "%" : ""}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-default-100">
        <div
          className="h-1.5 rounded-full bg-primary transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function AboutTab({
  bio,
  certifications,
  specialties,
  availability,
  active_clients,
  success_rate,
}: AboutTabProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="p-6 flex flex-col gap-5">
        <div>
          <p className="text-xs text-default-400 mb-1">Bio</p>
          <p className="text-sm text-foreground leading-relaxed">{bio}</p>
        </div>

        <div>
          <p className="text-xs text-default-400 mb-2">Certifications</p>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <span
                key={cert}
                className="flex items-center gap-1.5 text-xs text-default-600 border border-default-200 rounded-full px-3 py-1"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {cert}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-default-400 mb-2">Specialties</p>
          <div className="flex flex-wrap gap-2">
            {specialties.map((s) => (
              <span key={s} className="text-xs font-medium bg-primary text-white rounded-full px-3 py-1">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-default-400 mb-1">Availability</p>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {availability}
          </div>
        </div>
      </Card>

      <Card className="p-6 flex flex-col gap-4">
        <p className="text-base font-semibold text-foreground">Coach Stats</p>
        <StatBar label="Active Clients" value={active_clients} max={100} />
        <StatBar label="Success Rate" value={success_rate} max={100} />
      </Card>
    </div>
  );
}