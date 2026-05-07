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
import ContractActionModal from "./ContractActionModal";

type ContractsState = {
  pending: Contract[];
  active: Contract[];
  history: Contract[];
};

type ModalAction = "accept" | "terminate" | null;

export default function CoachContractsPanel() {
  const [contracts, setContracts] = useState<ContractsState>({
    pending: [],
    active: [],
    history: [],
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const [modalAction, setModalAction] = useState<ModalAction>(null);

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

  const getClientName = (contract: Contract | null) => {
    if (!contract) return "";

    const item = contract as Contract & {
      name?: string;
      first_name?: string;
      last_name?: string;
    };

    if (item.name) return item.name;

    return `${item.first_name || ""} ${item.last_name || ""}`.trim();
  };

  const closeModal = () => {
    if (actionLoading) return;

    setSelectedContract(null);
    setModalAction(null);
  };

  const openAcceptModal = (contract: Contract) => {
    setSelectedContract(contract);
    setModalAction("accept");
  };

  const openTerminateModal = (contract: Contract) => {
    setSelectedContract(contract);
    setModalAction("terminate");
  };

  const handleAccept = async () => {
    if (!selectedContract) return;

    try {
      setActionLoading(true);

      await acceptCoachContract(selectedContract.contract_id);

      toast.success("Contract accepted successfully!");

      setContracts((prev) => ({
        ...prev,
        pending: prev.pending.filter(
          (c) => c.contract_id !== selectedContract.contract_id,
        ),
        active: [...prev.active, { ...selectedContract, active: 1 }],
      }));

      setSelectedContract(null);
      setModalAction(null);
    } catch (err: any) {
      toast("Failed to accept contract", { variant: "danger" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectCoachContract(id);

      toast.success("Contract rejected successfully!");

      setContracts((prev) => ({
        ...prev,
        pending: prev.pending.filter((c) => c.contract_id !== id),
      }));
    } catch (err: any) {
      toast("Failed to reject contract", { variant: "danger" });
    }
  };

  const handleTerminate = async () => {
    if (!selectedContract) return;

    try {
      setActionLoading(true);

      await terminateCoachContract(selectedContract.contract_id);

      toast.success("Contract terminated successfully!");

      setContracts((prev) => ({
        ...prev,
        active: prev.active.filter(
          (c) => c.contract_id !== selectedContract.contract_id,
        ),
        history: [
          ...prev.history,
          { ...selectedContract, end_date: new Date().toISOString() },
        ],
      }));

      setSelectedContract(null);
      setModalAction(null);
    } catch (err: any) {
      toast("Failed to terminate contract", { variant: "danger" });
    } finally {
      setActionLoading(false);
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
    <>
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
                      onClick={() => openAcceptModal(c)}
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
                    onClick={() => openTerminateModal(c)}
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

      {modalAction && (
        <ContractActionModal
          isOpen={Boolean(modalAction)}
          actionType={modalAction}
          clientName={getClientName(selectedContract)}
          isLoading={actionLoading}
          onClose={closeModal}
          onConfirm={modalAction === "accept" ? handleAccept : handleTerminate}
        />
      )}
    </>
  );
}
