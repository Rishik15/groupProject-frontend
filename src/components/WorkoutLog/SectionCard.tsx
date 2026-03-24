import type { ReactNode } from "react";

interface WorkoutLogSectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function WorkoutLogSectionCard({
  title,
  description,
  children,
}: WorkoutLogSectionCardProps) {
  return (
    <section className="rounded-2xl border border-blue-600/30 bg-white p-4">
      <div className="mb-4">
        <h3 className="text-[13.125px] font-semibold text-[#0F0F14]">
          {title}
        </h3>

        {description ? (
          <p className="mt-1 text-[11.25px] text-[#72728A]">{description}</p>
        ) : null}
      </div>

      {children}
    </section>
  );
}
