import { Spinner } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

import CoachSessionScheduleSection from "../../components/CoachSessionSchedule/CoachSessionScheduleSection";
import { getClients } from "../../services/ManageClients/getClients";
import type { CoachSessionClient } from "../../utils/Interfaces/CoachSession/coachSession";

function normalizeClient(client: any): CoachSessionClient | null {
  const contractId = Number(client.contract_id || client.contractId);

  if (!contractId) {
    return null;
  }

  const fullName =
    client.name ||
    `${client.first_name || ""} ${client.last_name || ""}`.trim();

  const nameParts = fullName.split(" ");
  const firstName =
    client.first_name || client.firstName || nameParts[0] || "Client";
  const lastName =
    client.last_name || client.lastName || nameParts.slice(1).join(" ") || "";

  return {
    contractId,
    userId: client.user_id || client.userId || client.client_id || null,
    firstName,
    lastName,
    name: fullName || `${firstName} ${lastName}`.trim(),
    email: client.email || null,
  };
}

export default function CoachSession() {
  const [clients, setClients] = useState<CoachSessionClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;

    hasLoadedRef.current = true;

    async function loadClients() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const data = await getClients();
        const rawClients = Array.isArray(data) ? data : data.clients || [];

        const normalizedClients = rawClients
          .map(normalizeClient)
          .filter(Boolean) as CoachSessionClient[];

        setClients(normalizedClients);
      } catch (error) {
        console.error("Failed to load coach clients", error);
        setErrorMessage("Failed to load clients.");
      } finally {
        setIsLoading(false);
      }
    }

    loadClients();
  }, []);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6 py-8">
        <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4 shadow-sm">
          <Spinner size="sm" />
          <p className="text-[14px] font-medium text-[#72728A]">
            Loading sessions...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {errorMessage ? (
        <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-500">
          {errorMessage}
        </div>
      ) : null}

      <CoachSessionScheduleSection clients={clients} />
    </main>
  );
}
