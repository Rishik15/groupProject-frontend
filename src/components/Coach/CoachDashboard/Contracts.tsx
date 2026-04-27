import { useEffect, useState } from "react";
import { Spinner, Tabs } from "@heroui/react";
import { Check, X, Trash } from "lucide-react";
import { getContracts } from "../../../services/dashboard/coach/getContracts";
import type { Contract } from "../../../utils/Interfaces/Dashboard/Coach/types";
import List from "./List";
import { ActionBtn } from "./ActionButton";
import {
  acceptCoachContract,
  rejectCoachContract,
  terminateCoachContract,
} from "../../../services/Contracts/coachContractService";
import { toast } from "@heroui/react";

type ContractsState = {
  pending: Contract[];
  active: Contract[];
  history: Contract[];
};

export default function CoachContractsPanel() {
  const [contracts, setContracts] = useState<ContractsState>({
    pending: [],
    active: [],
    history: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContracts();

        setContracts({
          pending: data.pending_requests,
          active: data.present_contracts,
          history: data.history_contracts,
        });
      } catch (err) {
        console.error("failed to fetch contracts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (id: number) => {
    try {
      const res = await acceptCoachContract(id);

      toast.success("Contract accepted successfully!");

      const contract = contracts.pending.find((c) => c.contract_id === id);
      console.log(contract);
      if (!contract) return;

      setContracts((prev) => ({
        ...prev,
        pending: prev.pending.filter((c) => c.contract_id !== id),
        active: [...prev.active, { ...contract, active: 1 }],
      }));
    } catch (err: any) {
      toast("Failed to accept contract", { variant: "danger" });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await rejectCoachContract(id);

      toast.success("Contract rejected successfully!");

      setContracts((prev) => ({
        ...prev,
        pending: prev.pending.filter((c) => c.contract_id !== id),
      }));
    } catch (err: any) {
      toast("Failed to reject contract", { variant: "danger" });
    }
  };

  const handleTerminate = async (id: number) => {
    try {
      const res = await terminateCoachContract(id);

      toast.success("Contract terminated successfully!");

      const contract = contracts.active.find((c) => c.contract_id === id);
      if (!contract) return;

      setContracts((prev) => ({
        ...prev,
        active: prev.active.filter((c) => c.contract_id !== id),
        history: [
          ...prev.history,
          { ...contract, end_date: new Date().toISOString() },
        ],
      }));
    } catch (err: any) {
      toast("Failed to terminate contract", { variant: "danger" });
    }
  };
  if (loading) {
    return (
      <section className="flex justify-center items-center py-20 px-38">
        <Spinner />
      </section>
    );
  }

  return (
    <section className="flex flex-col px-38">
      <div className="bg-white rounded-4xl shadow-sm p-4">
        <Tabs defaultSelectedKey="pending">
          <Tabs.List
            aria-label="Contracts"
            className="bg-transparent flex gap-12 w-full items-center justify-center"
          >
            <Tabs.Tab id="pending" className="w-48 px-2">
              Pending Contracts ({contracts.pending.length})
              <Tabs.Indicator />
            </Tabs.Tab>

            <Tabs.Tab id="active" className="w-48 px-2">
              Active Contracts ({contracts.active.length})
              <Tabs.Indicator />
            </Tabs.Tab>

            <Tabs.Tab id="history" className="w-48 px-2">
              History Contracts ({contracts.history.length})
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel id="pending" className="pt-4">
            <List
              data={contracts.pending}
              renderActions={(c: Contract) => (
                <>
                  <ActionBtn
                    color="green"
                    onClick={() => handleAccept(c.contract_id)}
                    icon={<Check size={16} />}
                  />
                  <ActionBtn
                    color="gray"
                    onClick={() => handleReject(c.contract_id)}
                    icon={<X size={16} />}
                  />
                </>
              )}
            />
          </Tabs.Panel>

          <Tabs.Panel id="active" className="pt-4">
            <List
              data={contracts.active}
              renderActions={(c: Contract) => (
                <ActionBtn
                  color="red"
                  onClick={() => handleTerminate(c.contract_id)}
                  icon={<Trash size={16} />}
                />
              )}
            />
          </Tabs.Panel>

          <Tabs.Panel id="history" className="pt-4">
            <List data={contracts.history} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </section>
  );
}
