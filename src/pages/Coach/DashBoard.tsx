import { useEffect, useState } from "react";
import ViewCoachingContractsCard from "../../components/CoachContracts/viewCoachingContractsCard";
import { getAllCoachContracts } from "../../services/Contracts/coachContractService";
import { splitContractsByStatus } from "../../utils/coachContracts/coachContractHelpers";
import type { CoachContract } from "../../utils/Interfaces/Contracts/coachContracts";

const CoachDashBoard = () => {
  const [contracts, setContracts] = useState<CoachContract[]>([]);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        const data = await getAllCoachContracts();
        setContracts(data);
      } catch (error) {
        console.error("Failed to load dashboard contracts:", error);
      }
    };

    void loadContracts();
  }, []);

  const { pending } = splitContractsByStatus(contracts);

  return (
    <section className="px-6 py-8 md:px-10">
      <div className="mx-auto max-w-7xl px-36">
        <ViewCoachingContractsCard pendingCount={pending.length} />
      </div>
    </section>
  );
};

export default CoachDashBoard;
