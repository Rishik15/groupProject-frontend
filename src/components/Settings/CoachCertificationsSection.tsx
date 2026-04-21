import { Card } from "@heroui/react";

export default function CoachCertificationsSection() {
  return (
    <div className="w-full">
      <Card className="rounded-xl border border-[#E8E8EF] p-4 shadow-none">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-900">
            Coach Certifications
          </p>

          <div className="rounded-md bg-gray-100 px-3 py-3 text-sm text-gray-500">
            No certifications added yet
          </div>
        </div>
      </Card>
    </div>
  );
}